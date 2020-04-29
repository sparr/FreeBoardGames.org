/*
 * Copyright 2020 Clarence "Sparr" Risher <sparr0@gmail.com>
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import * as types from './types';
import * as hexes from './HexTypes';

import { IGameCtx } from 'boardgame.io/core';
import { INVALID_MOVE } from 'boardgame.io/core';

import * as EighteenEUGame from './games/18eu';

export interface IG {
  // game state
  game: '18eu';
  gamePhase: number;
  players: { [playerid: string]: types.Player };
  bank: types.Bank;
  pool: types.Pool;
  minors: { [minorid: number]: types.Minor };
  corporations: { [corpid: string]: types.Corporation };
  priority: types.PlayerID;
  tilesAvailable: { [hexid: string]: number };
  tilesPlaced: types.GridShape<{ tile: hexes.HexID; rot: hexes.HexDirection }>;
  tokensPlaced: types.GridShape<types.CompanyID[][]>; // [stop][slot]
  minorAuction?: {
    minor: types.MinorID;
    auctioneer: types.PlayerID;
    firstBidder?: types.PlayerID;
    minBid: number;
    passed?: { [playerID: string]: true };
    highBidder?: types.PlayerID;
    highBid?: types.Money;
  };
  stockMarketState: types.StockMarketState;
  operatingOrder?: types.CompanyID[];
  operatingOrderPos?: number;
}

export const EighteenXXGame = {
  name: '18xx',

  setup: (ctx: IGameCtx): IG => ({
    game: '18eu',
    gamePhase: 1,
    players: ctx.playOrder.reduce((players, playerID) => {
      return {
        ...players,
        [playerID]: {
          id: playerID,
          presidencies: {},
          cash: EighteenEUGame.startingMoney[ctx.numPlayers],
          minors: {},
          shares: {},
        },
      };
    }, {}),
    bank: {
      cash: 12000 - EighteenEUGame.startingMoney[ctx.numPlayers] * ctx.numPlayers,
      trains: Object.keys(EighteenEUGame.TrainInfo).reduce((trains, trainID) => {
        return { ...trains, [trainID]: EighteenEUGame.TrainInfo[trainID].count };
      }, {}),
      minors: Object.keys(EighteenEUGame.MinorInfo).reduce((a, b) => {
        return { ...a, [b]: true };
      }, {}),
      shares: {},
    },
    pool: {
      trains: {},
      shares: {},
    },
    minors: Object.keys(EighteenEUGame.MinorInfo).reduce((minors, minorID) => {
      return {
        ...minors,
        [minorID]: { id: minorID, owner: '', hasOperated: false, tokensLeft: 1, cash: 0, trains: {} },
      };
    }, {}),
    corporations: Object.keys(EighteenEUGame.CorporationInfo).reduce((corporations, corporationID) => {
      return {
        ...corporations,
        [corporationID]: {
          id: corporationID,
          president: '',
          hasFloated: false,
          initialPrice: -1,
          currentPrice: -1,
          revenueHistory: [],
          dividendHistory: [],
          hasOperated: false,
          tokensLeft: 1,
          cash: 0,
          trains: {},
          shares: {},
        },
      };
    }, {}),
    priority: '0',
    tilesAvailable: EighteenEUGame.tiles.reduce((tiles, tileCount) => {
      return { ...tiles, [tileCount[0].toString()]: tileCount[1] };
    }, {}),
    tilesPlaced: [],
    tokensPlaced: [],
    stockMarketState: [],
  }),

  turn: {
    order: {
      //FIXME: these should be optional and use defaults otherwise!
      first: () => 0,
      next: (G: IG, ctx: IGameCtx) => (ctx.playOrderPos + 1) % ctx.numPlayers,

      // Randomize initial value of playOrder.
      // This is called at the beginning of the game / phase.
      // bg.io bug, ctx.random doesn't exist? https://github.com/nicolodavis/boardgame.io/issues/605
      // playOrder: (G: IG, ctx: IGameCtx) => ctx.random.Shuffle(ctx.playOrder),
      playOrder: (G: IG, ctx: IGameCtx) => ctx.playOrder,
    },
  },

  phases: {
    // Minor Company Initial Sale Round
    mcisrChooseMinor: {
      turn: {
        order: {
          first: (G: IG, ctx: IGameCtx) => {
            // if we return to this phase after a previous auction, advance the auctioneer
            if (G.minorAuction) {
              return (ctx.playOrder.lastIndexOf(G.minorAuction.auctioneer) + 1) % ctx.numPlayers;
            }
            return 0;
          },
        },
      },
      start: true, // game starts here
      moves: { mcisrChooseMinor },
      endIf: (G: IG) => Object.keys(G.bank.minors).length == 0,
      next: 'operatingRound',
    },

    mcisrStartAuction: {
      moves: { mcisrStartAuctionStart, mcisrStartAuctionDecline },
      turn: {
        order: {
          first: (G: IG, ctx: IGameCtx) => {
            return ctx.playOrder.lastIndexOf(G.minorAuction.auctioneer);
          },
          next: (G: IG, ctx: IGameCtx) => {
            let nextPlayOrderPos = (ctx.playOrderPos + 1) % ctx.numPlayers;
            if (ctx.playOrder[nextPlayOrderPos] != G.minorAuction.auctioneer) {
              return nextPlayOrderPos;
            }
          },
        },
      },
      next: 'mcisrDiscountRound',
    },

    mcisrAuction: {
      next: 'mcisrChooseMinor',
      moves: { mcisrAuctionBid, mcisrAuctionPass },
      turn: {
        order: {
          first: (G: IG, ctx: IGameCtx) => (ctx.playOrder.lastIndexOf(G.minorAuction.firstBidder) + 1) % ctx.numPlayers,
          // skip players who have passed
          next: (G: IG, ctx: IGameCtx) => {
            // find the first player who hasn’t passed
            for (let i = 1; i < ctx.playOrder.length; i++) {
              const nextId = ctx.playOrder[(ctx.playOrderPos + i) % ctx.playOrder.length];
              if (!G.minorAuction.passed[nextId]) {
                // convert the player ID to its play order index
                return (ctx.playOrderPos + i) % ctx.playOrder.length;
              }
            }
          },
        },
      },
    },

    mcisrDiscountRound: {
      next: 'mcisrChooseMinor',
      moves: { mcisrDiscountBuy, mcisrDiscountPass },
      turn: {
        onBegin: (G: IG, ctx: IGameCtx) => {
          if (ctx.playOrder[ctx.playOrderPos] === G.minorAuction.auctioneer) {
            G.minorAuction.minBid -= 10;
          }
          if (G.minorAuction.minBid === 0) {
            if (playerBuyMinor(G, ctx, G.minorAuction.auctioneer, G.minorAuction.minor, 0) === INVALID_MOVE)
              return INVALID_MOVE;
            ctx.events.endPhase();
          }
          return G;
        },
      },
    },

    operatingRound: {
      moves: {},
      onBegin: (G: IG) => {
        delete G.minorAuction;
        if (G.gamePhase == 1) G.gamePhase = 2;
        let minorOperatingOrder = Object.keys(G.minors).filter((minorID) => !G.bank.minors[minorID]);
        let corporationOperatingOrder = Object.keys(G.corporations)
          .filter((corporationID) => G.corporations[corporationID].president != '')
          .filter((corporationID) => G.corporations[corporationID].hasFloated)
          .filter((corporationID) => {
            let stockPos = G.corporations[corporationID].currentStockMarketPosition;
            let stockState = G.stockMarketState[stockPos.row][stockPos.col];
            let tokenState = stockState.tokens.find((token) => token.corpID == corporationID).flipped;
            return tokenState != true;
          })
          .sort((corpID1, corpID2) => {
            let stockPos1 = G.corporations[corpID1].currentStockMarketPosition;
            let stockPos2 = G.corporations[corpID2].currentStockMarketPosition;
            let stockData1 = EighteenEUGame.StockMarket[stockPos1.row][stockPos1.col];
            let stockData2 = EighteenEUGame.StockMarket[stockPos2.row][stockPos2.col];
            if (stockData1.value != stockData2.value) {
              return stockData2.value - stockData1.value;
            }
            if (stockPos1.col != stockPos2.col) {
              return stockPos2.col - stockPos1.col;
            }
            if (stockPos1.row != stockPos2.row) {
              return stockPos2.row - stockPos1.row;
            }
            let stockState = G.stockMarketState[stockPos1.row][stockPos1.col];
            let tokenIndex1 = stockState.tokens.findIndex((token) => token.corpID == corpID1);
            let tokenIndex2 = stockState.tokens.findIndex((token) => token.corpID == corpID2);
            return tokenIndex2 - tokenIndex1;
          });
        G.operatingOrder = minorOperatingOrder.concat(corporationOperatingOrder);
        G.operatingOrderPos = 0;
        return G;
      },
      turn: {
        stages: {
          layTrack: {
            moves: { layTrack, layTrackPass },
            next: 'placeToken',
          },
          placeToken: {
            moves: { placeToken, placeTokenPass },
            next: 'operateTrains',
          },
          operateTrains: {
            moves: { operateTrainsPayFull, operateTrainsPayHalf, operateTrainsWithhold, operateTrainsPass },
            next: 'purchaseTrains',
          },
          purchaseTrains: {
            moves: { purchaseTrainFromBank, purchaseTrainFromCompany, purchaseTrainPass },
            next: 'transactStock',
          },
          transactStock: {
            moves: { transactStockBuy, transactStockSell, transactStockPass },
            next: 'emergencyFunding',
          },
          emergencyFunding: {
            moves: { emergencyFundingSellStock, emergencyFundingBuyTrain, emergencyFundingDeclareBankruptcy },
          },
        },
        order: {
          first: (G: IG, ctx: IGameCtx) =>
            ctx.playOrder.lastIndexOf(G.corporations[G.operatingOrder[G.operatingOrderPos]].president),
          next: (G: IG, ctx: IGameCtx) => {
            G.operatingOrderPos += 1;
            if (G.operatingOrderPos < G.operatingOrder.length) {
              return ctx.playOrder.lastIndexOf(G.corporations[G.operatingOrder[G.operatingOrderPos]].president);
            }
          },
        },
      },
    },
  },
};

function mcisrChooseMinor(G: IG, ctx: IGameCtx, choice: types.MinorID) {
  if (!choice || G.minors[choice].owner != '' || !Object.keys(G.bank.minors).includes(choice.toString()))
    return INVALID_MOVE;
  G.minorAuction = { minor: choice, auctioneer: ctx.currentPlayer, minBid: 20 };
  ctx.events.setPhase('mcisrStartAuction');
  return G;
}

function mcisrStartAuctionStart(G: IG, ctx: IGameCtx, bid: types.Money) {
  if (!bid || bid < 100 || bid % 5 != 0) return INVALID_MOVE;
  G.minorAuction.passed = {};
  G.minorAuction.firstBidder = ctx.currentPlayer;
  G.minorAuction.highBidder = ctx.currentPlayer;
  G.minorAuction.highBid = bid;
  ctx.events.setPhase('mcisrAuction');
  return G;
}

function mcisrStartAuctionDecline(G: IG, ctx: IGameCtx) {
  ctx.events.endTurn();
  return G;
}

function mcisrAuctionBid(G: IG, ctx: IGameCtx, bid: types.Money) {
  if (!bid || bid < G.minorAuction.highBid + 5 || bid % 5 != 0 || bid > G.players[ctx.currentPlayer].cash)
    return INVALID_MOVE;
  G.minorAuction.highBidder = ctx.currentPlayer;
  G.minorAuction.highBid = bid;
  ctx.events.endTurn();
  return G;
}

function mcisrAuctionPass(G: IG, ctx: IGameCtx) {
  G.minorAuction.passed[ctx.currentPlayer] = true;
  ctx.events.endTurn();
  if (Object.keys(G.minorAuction.passed).length == ctx.numPlayers - 1) {
    if (
      playerBuyMinor(G, ctx, G.minorAuction.highBidder, G.minorAuction.minor, G.minorAuction.highBid) === INVALID_MOVE
    )
      return INVALID_MOVE;
    ctx.events.endPhase();
  }
  return G;
}

function playerBuyMinor(G: IG, ctx: IGameCtx, player: types.PlayerID, minor: types.MinorID, cost: types.Money) {
  if (G.players[player].cash < cost) return INVALID_MOVE;
  if (G.minors[minor].owner != '') return INVALID_MOVE;
  if (G.bank.trains[2] < 1) return INVALID_MOVE;
  G.minors[minor].owner = player;
  G.players[player].minors[minor] = true;
  delete G.bank.minors[minor];
  G.minors[minor].trains[2] = 1;
  G.bank.trains[2] -= 1;
  G.players[player].cash -= cost;
  G.bank.cash += cost;
}

function mcisrDiscountBuy(G: IG, ctx: IGameCtx) {
  if (playerBuyMinor(G, ctx, ctx.currentPlayer, G.minorAuction.minor, G.minorAuction.minBid) === INVALID_MOVE)
    return INVALID_MOVE;
  ctx.events.endPhase();
  return G;
}

function mcisrDiscountPass(G: IG, ctx: IGameCtx) {
  ctx.events.endTurn();
  return G;
}

function layTrack(G: IG, ctx: IGameCtx, row: number, col: number, rot: hexes.HexDirection, tile: hexes.HexID) {
  //TODO check for placement legality
  //TODO check for upgrade legality
  //TODO allow minors to play two yellow on their first turn
  if (G.tilesAvailable[tile] > 0) {
    let prev = types.gridGet(G.tilesPlaced, row, col, null);
    if (prev != null) {
      G.tilesAvailable[prev.tile]++;
    }
    G.tilesAvailable[tile]--;
    types.gridSet(G.tilesPlaced, row, col, { tile: tile, rot: rot });
  } else {
    return INVALID_MOVE;
  }
  ctx.events.endStage();
  return G;
}

function layTrackPass(G: IG, ctx: IGameCtx) {
  ctx.events.endStage();
  return G;
}

function placeToken(G: IG, ctx: IGameCtx, row: number, col: number, stop: number, slot: number) {
  let companyID = G.operatingOrder[G.operatingOrderPos];
  let company = getCompany(G, companyID);
  if (!(company.tokensLeft >= 1)) {
    return INVALID_MOVE;
  }
  let mapSpace = types.gridGet(G.tokensPlaced, row, col, []);
  let prevToken = types.gridGet(mapSpace, stop, slot, null);
  if (prevToken != null) {
    return INVALID_MOVE;
  }
  company.tokensLeft -= 1;
  types.gridSet(mapSpace, stop, slot, companyID);
  types.gridSet(G.tokensPlaced, row, col, mapSpace);
  ctx.events.endStage();
  return G;
}

function placeTokenPass(G: IG, ctx: IGameCtx) {
  ctx.events.endStage();
  return G;
}

function companyShareholders(G: IG, companyID: types.CompanyID): { [shareholder: string]: number } {
  let shareholders = {};
  if (companyID in G.minors) {
    if (G.minors[companyID].owner) {
      shareholders[G.minors[companyID].owner] = 1;
    }
  } else {
    for (const playerID in G.players) {
      if (G.players.hasOwnProperty(playerID)) {
        const player = G.players[playerID];
        if (companyID in player.shares) {
          shareholders[player.id] = player.shares[companyID];
        }
      }
    }
    for (const corpID in G.corporations) {
      if (G.corporations.hasOwnProperty(corpID)) {
        const corp = G.corporations[corpID];
        if (companyID in corp.shares) {
          shareholders[corp.id] = corp.shares[companyID];
        }
      }
    }
  }
  return shareholders;
}

function getCompany(G: IG, id: types.CompanyID): types.Company;
function getCompany(G: IG, id: types.CorporationID): types.Corporation;
function getCompany(G: IG, id: types.MinorID): types.Minor;
function getCompany(G, id): any {
  if (id in G.minors) {
    return G.minors[id];
  } else if (id in G.corporations) {
    return G.corporations[id];
  }
}

function operateTrains(G: IG, revenue: types.Money, payoutPct: number) {
  //TODO automatic routes calculation
  let companyID = G.operatingOrder[G.operatingOrderPos];
  let shareholders = companyShareholders(G, companyID);
  let totalShares = 10;
  if (companyID in G.minors) {
    totalShares = 1;
  }
  let shareValue = Math.ceil((revenue * (payoutPct / 100)) / totalShares);
  let withholdAmount = revenue - shareValue * totalShares;
  for (const id in shareholders) {
    if (shareholders.hasOwnProperty(id)) {
      const shares = shareholders[id];
      G.bank.cash -= shares * shareValue;
      if (id in G.players) {
        G.players[id].cash += shares * shareValue;
      } else if (id in G.corporations) {
        G.corporations[id].cash += shares * shareValue;
      } else {
        //wtf?
      }
    }
  }
  G.bank.cash -= withholdAmount;
  getCompany(G, companyID).cash += withholdAmount;
}

function operateTrainsPayFull(G: IG, ctx: IGameCtx, revenue: types.Money) {
  operateTrains(G, revenue, 100);
  ctx.events.endStage();
  return G;
}

function operateTrainsPayHalf(G: IG, ctx: IGameCtx, revenue: types.Money) {
  operateTrains(G, revenue, 50);
  ctx.events.endStage();
  return G;
}

function operateTrainsWithhold(G: IG, ctx: IGameCtx, revenue: types.Money) {
  operateTrains(G, revenue, 0);
  ctx.events.endStage();
  return G;
}

function operateTrainsPass(G: IG, ctx: IGameCtx) {
  ctx.events.endStage();
  return G;
}

function purchaseTrainFromBank(G: IG, ctx: IGameCtx, trainType: types.TrainType) {
  let companyID = G.operatingOrder[G.operatingOrderPos];
  let company = getCompany(G, companyID);
  //TODO enforce train limits
  if (!(G.bank.trains[trainType] > 0)) {
    return INVALID_MOVE;
  }
  if (company.cash < EighteenEUGame.TrainInfo[trainType].cost) {
    return INVALID_MOVE;
  }
  G.bank.trains[trainType] -= 1;
  if (G.bank.trains[trainType] == 0) {
    delete G.bank.trains[trainType];
  }
  company.trains[trainType] = (company.trains[trainType] || 0) + 1;
  company.cash -= EighteenEUGame.TrainInfo[trainType].cost;
  G.bank.cash += EighteenEUGame.TrainInfo[trainType].cost;
  return G;
}

function purchaseTrainFromCompany(
  G: IG,
  ctx: IGameCtx,
  companyID2: types.CompanyID,
  trainType: types.TrainType,
  price: types.Money,
) {
  //TODO require approval from other owner
  //TODO enforce train limits
  let companyID = G.operatingOrder[G.operatingOrderPos];
  let company = getCompany(G, companyID);
  let company2 = getCompany(G, companyID2);
  if (!(company2.trains[trainType] > 0)) {
    return INVALID_MOVE;
  }
  if (company.cash < price) {
    return INVALID_MOVE;
  }
  if (price < 0 || !Number.isInteger(price)) {
    return INVALID_MOVE;
  }
  company2.trains[trainType] -= 1;
  if (company2.trains[trainType] == 0) {
    delete company2.trains[trainType];
  }
  company.trains[trainType] = (company.trains[trainType] || 0) + 1;
  company.cash -= price;
  company2.cash += price;
  return G;
}

function purchaseTrainPass(G: IG, ctx: IGameCtx) {
  ctx.events.endStage();
  return G;
}

function transactStockBuy(G: IG, ctx: IGameCtx, qty: number) {
  let companyID = G.operatingOrder[G.operatingOrderPos];
  if (companyID in G.minors) {
    return INVALID_MOVE;
  }
  if (!(G.pool.shares[companyID] >= qty)) {
    return INVALID_MOVE;
  }
  let company = getCompany(G, companyID);
  let shareValue = types.stockValue(EighteenEUGame.StockMarket, company.currentStockMarketPosition);
  if (company.cash < shareValue * qty) {
    return INVALID_MOVE;
  }
  company.cash -= shareValue * qty;
  G.bank.cash += shareValue * qty;
  G.pool.shares[companyID] -= qty;
  if (G.pool.shares[companyID] == 0) {
    delete G.pool.shares[companyID];
  }
  company.shares[companyID] = (company.shares[companyID] || 0) + qty;
  ctx.events.endStage();
  return G;
}

function stockTokenMove(
  G: IG,
  corpID: types.CorporationID,
  oldpos: types.StockMarketPosition,
  newpos: types.StockMarketPosition,
) {
  // foo
}

function stockPriceDown(G: IG, corpID: types.CorporationID, times: number = 1) {
  if (!(corpID in G.corporations)) {
    return INVALID_MOVE;
  }
  let corp = getCompany(G, corpID);
  for (let time = 0; time < times; time++) {
    let pos = corp.currentStockMarketPosition;
    if (EighteenEUGame.StockMarket[pos.row + 1]) {
      pos.row += 1;
    }
  }
  // return something?
}

function stockPriceLeft(G: IG, corpID: types.CorporationID) {
  if (!(corpID in G.corporations)) {
    return INVALID_MOVE;
  }
  let corp = getCompany(G, corpID);
  let pos = corp.currentStockMarketPosition;
  pos.col = Math.max(pos.col - 1, 0);
  // return something?
}

function stockPriceRight(G: IG, corpID: types.CorporationID) {
  if (!(corpID in G.corporations)) {
    return INVALID_MOVE;
  }
  let corp = getCompany(G, corpID);
  let pos = corp.currentStockMarketPosition;
  if (EighteenEUGame.StockMarket[pos.row][pos.col + 1]) {
    pos.col += 1;
  } else if (EighteenEUGame.StockMarket[pos.row - 1]) {
    pos.row -= 1;
  }
  // return something?
}

function stockPriceUp(G: IG, corpID: types.CorporationID) {
  if (!(corpID in G.corporations)) {
    return INVALID_MOVE;
  }
  let corp = getCompany(G, corpID);
  let pos = corp.currentStockMarketPosition;
  if (EighteenEUGame.StockMarket[pos.row - 1]) {
    pos.row -= 1;
  }
  // return something?
}

function sellShares(G: IG, corpID: types.CorporationID, qty: number) {
  //TODO enforce pool share limits
  G.pool.shares[corpID] = (G.pool.shares[corpID] || 0) + qty;
  let corp = getCompany(G, corpID);
  if (!(corp.shares[corpID] >= qty)) {
    return INVALID_MOVE;
  }
  let shareValue = types.stockValue(EighteenEUGame.StockMarket, corp.currentStockMarketPosition);
  corp.cash += shareValue * qty;
  corp.shares[corpID] -= qty;
  G.pool.shares[corpID] = (G.pool.shares[corpID] || 0) + qty;
  stockPriceDown(G, corpID, qty);
}

function transactStockSell(G: IG, ctx: IGameCtx, qty: number) {
  let companyID = G.operatingOrder[G.operatingOrderPos];
  if (companyID in G.minors) {
    return INVALID_MOVE;
  }
  let company = getCompany(G, companyID);
  if (!company.hasOperated) {
    return INVALID_MOVE;
  }
  if (!(company.shares[companyID] >= qty)) {
    return INVALID_MOVE;
  }
  return G;
}

function transactStockPass(G: IG, ctx: IGameCtx) {
  ctx.events.endStage();
  return G;
}

function emergencyFundingSellStock(G: IG, ctx: IGameCtx) {
  return G;
}

function emergencyFundingBuyTrain(G: IG, ctx: IGameCtx) {
  return G;
}

function emergencyFundingDeclareBankruptcy(G: IG, ctx: IGameCtx) {
  return G;
}
