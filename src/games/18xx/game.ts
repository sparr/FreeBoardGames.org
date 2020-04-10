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
import { TurnOrder } from 'boardgame.io/core';
import { INVALID_MOVE } from 'boardgame.io/core';

var games = {};
games['18eu'] = import('./games/18eu');

export interface IG {
  // game state
  game: '18eu';
  players: { [playerid: string]: types.Player };
  bank: types.Bank;
  pool: types.Pool;
  minors: { [minorid: string]: types.Minor };
  corporations: { [corpid: string]: types.Corporation };
  priority: types.PlayerID;
  tilesAvailable: { [hexid: string]: number };
  tilesPlaced: { [row: number]: { [column: number]: hexes.HexID } };
  tokensPlaced: { [companyid: string]: { row: number; column: number; stop: number; slot: number }[] };
  minorAuction?: {
    minor: types.MinorID;
    auctioneer: types.PlayerID;
    minBid: number;
    passed?: { [playerID: string]: true };
    highBidder?: types.PlayerID;
    highBid?: types.Money;
  };
}

export const EighteenXXGame = {
  name: '18xx',

  setup: (ctx: IGameCtx): IG => ({
    game: '18eu',
    players: ctx.playOrder.reduce(
      (players, playerID) =>
        (players[playerID] = {
          id: playerID,
          presidencies: {},
          cash: games['18eu'].startingMoney[ctx.numPlayers],
          minors: {},
          shares: {},
        }),
      {},
    ),
    bank: {
      cash: 12000 - games['18eu'].startingMoney[ctx.numPlayers] * ctx.numPlayers,
      trains: {}, //FIXME: starting train counts
      minors: games['18eu'].MinorInfo.keys().reduce((a, b) => ((a[b] = true), a), {}),
      shares: {},
    },
    pool: {
      trains: {},
      shares: {},
    },
    minors: games['18eu'].MinorInfo.keys().reduce(
      (minors, minorID) =>
        (minors[minorID] = { id: minorID, owner: '', hasOperated: false, tokensLeft: 1, cash: 0, trains: {} }),
      {},
    ),
    corporations: games['18eu'].CorporationInfo.keys().reduce(
      (corporations, corporationID) =>
        (corporations[corporationID] = {
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
        }),
      {},
    ),
    priority: '0',
    tilesAvailable: games['18eu'].tiles.reduce(
      (tiles, tileCount) => (tiles[tileCount[0].toString()] = tileCount[1]),
      {},
    ),
    tilesPlaced: {},
    tokensPlaced: {},
  }),

  turn: {
    order: {
      // Randomize initial value of playOrder.
      // This is called at the beginning of the game / phase.
      playOrder: (G, ctx) => ctx.shuffle(ctx.playOrder),
    },
  },

  phases: {
    // Minor Company Initial Sale Round
    mcisrChooseMinor: {
      start: true, // game starts here
      moves: { mcisrChooseMinor },
    },

    mcisrStartAuction: {
      moves: { mcisrStartAuctionStart, mcisrStartAuctionDecline },
      turn: { order: TurnOrder.ONCE },
      next: 'mcisrDiscountRound',
    },

    mcisrAuction: {
      moves: { mcisrAuctionBid, mcisrAuctionPass },
      turn: {
        order: {
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
      // moves: { mcisrDiscountBuy, mcisrDiscountPass },
    },
  },
};

function mcisrChooseMinor(G: IG, ctx: IGameCtx, choice: types.MinorID) {
  if (G.minors[choice].owner != '' || !(choice in Object.keys(G.minors))) return INVALID_MOVE;
  G.minorAuction = { minor: choice, auctioneer: ctx.currentPlayer, minBid: 100 };
  ctx.events.setPhase('mcisrStartAuction');
}

function mcisrStartAuctionStart(G: IG, ctx: IGameCtx, bid: types.Money) {
  if (bid < 100 || bid % 5 != 0) return INVALID_MOVE;
  G.minorAuction.passed = {};
  G.minorAuction.highBidder = ctx.currentPlayer;
  G.minorAuction.highBid = bid;
  ctx.events.setPhase('mcisrAuction');
}

function mcisrStartAuctionDecline() {}

function mcisrAuctionBid(G: IG, ctx: IGameCtx, bid: types.Money) {
  if (bid < G.minorAuction.highBid + 5 || bid % 5 != 0) return INVALID_MOVE;
  G.minorAuction.highBidder = ctx.currentPlayer;
  G.minorAuction.highBid = bid;
}

function mcisrAuctionPass(G: IG, ctx: IGameCtx) {
  G.minorAuction.passed[ctx.currentPlayer] = true;
  if (Object.keys(G.minorAuction.passed).length == ctx.numPlayers - 1) {
    G.minors[G.minorAuction.minor].owner = G.minorAuction.highBidder;
    G.players[G.minorAuction.highBidder].minors[G.minorAuction.minor] = true;
    G.minors[G.minorAuction.minor].trains[2] = 1;
    G.bank.trains[2] -= 1;
    ctx.events.endPhase();
  }
}
