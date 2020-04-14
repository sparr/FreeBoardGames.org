/*
 * Copyright 2020 Clarence "Sparr" Risher <sparr0@gmail.com>
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import * as types from './types';
import * as hexes from './hexes';

import { IGameCtx } from 'boardgame.io/core';
import { INVALID_MOVE } from 'boardgame.io/core';

var games = {};
import * as EighteenEUGame from './games/18eu';
games['18eu'] = EighteenEUGame;

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
  tilesPlaced: { [row: number]: { [column: number]: hexes.HexID } };
  tokensPlaced: { [companyid: string]: { row: number; column: number; stop: number; slot: number }[] };
  minorAuction?: {
    minor: types.MinorID;
    auctioneer: types.PlayerID;
    firstBidder?: types.PlayerID;
    minBid: number;
    passed?: { [playerID: string]: true };
    highBidder?: types.PlayerID;
    highBid?: types.Money;
  };
  operatingOrder?: Array<types.CompanyID>;
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
          cash: games['18eu'].startingMoney[ctx.numPlayers],
          minors: {},
          shares: {},
        },
      };
    }, {}),
    bank: {
      cash: 12000 - games['18eu'].startingMoney[ctx.numPlayers] * ctx.numPlayers,
      trains: Object.keys(games['18eu'].TrainInfo).reduce((trains, trainID) => {
        return { ...trains, [trainID]: games['18eu'].TrainInfo[trainID].count };
      }, {}),
      minors: Object.keys(games['18eu'].MinorInfo).reduce((a, b) => {
        return { ...a, [b]: true };
      }, {}),
      shares: {},
    },
    pool: {
      trains: {},
      shares: {},
    },
    minors: Object.keys(games['18eu'].MinorInfo).reduce((minors, minorID) => {
      return {
        ...minors,
        [minorID]: { id: minorID, owner: '', hasOperated: false, tokensLeft: 1, cash: 0, trains: {} },
      };
    }, {}),
    corporations: Object.keys(games['18eu'].CorporationInfo).reduce((corporations, corporationID) => {
      return {
        ...corporations,
        [corporationID]: {
          id: corporationID,
          president: '',
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
    tilesAvailable: games['18eu'].tiles.reduce((tiles, tileCount) => {
      return { ...tiles, [tileCount[0].toString()]: tileCount[1] };
    }, {}),
    tilesPlaced: {},
    tokensPlaced: {},
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
        let minorOperatingOrder = Object.keys(G.minors).filter(minorID => !G.bank.minors[minorID]);
        let corporationOperatingOrder =
          Object.keys(G.corporations)
          .filter(corporationID => G.corporations[corporationID].president != '')
          .sort((corpID1, corpID2) => {return 1});
        return G;
      },
      turn: {
        order: {
          first: () => 0,
          next: (G: IG, ctx: IGameCtx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
    
          // Randomize initial value of playOrder.
          // This is called at the beginning of the game / phase.
          // bg.io bug, ctx.random doesn't exist? https://github.com/nicolodavis/boardgame.io/issues/605
          // playOrder: (G: IG, ctx: IGameCtx) => ctx.random.Shuffle(ctx.playOrder),
          playOrder: (G: IG, ctx: IGameCtx) => ctx.playOrder,
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
