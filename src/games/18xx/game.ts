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
  players: Map<types.TPlayerID, types.IPlayer>;
  bank: types.IBank;
  pool: types.IPool;
  minors: Map<types.TMinorID, types.IMinor>;
  corporations: Map<types.TCorporationID, types.ICorporation>;
  priority: types.TPlayerID;
  tilesAvailable: Map<hexes.HexID, number>;
  tilesPlaced: { [row: number]: { [column: number]: hexes.HexID } };
  tokensPlaced: Map<types.TCompanyID, { row: number; column: number; stop: number; slot: number }[]>;
  minorAuction?: {
    minor: types.TMinorID;
    auctioneer: types.TPlayerID;
    minBid: number;
    passed?: Set<types.TPlayerID>;
    highBidder?: types.TPlayerID;
    highBid?: types.TMoney;
  };
}

export const EighteenXXGame = {
  name: '18xx',

  setup: (ctx: IGameCtx): IG => ({
    game: '18eu',
    players: new Map(
      ctx.playOrder.map((playerID) => [
        playerID,
        {
          id: playerID,
          presidencies: new Set(),
          cash: games['18eu'].startingMoney[ctx.numPlayers],
          minors: new Set(),
          shares: new Map(),
        },
      ]),
    ),
    bank: {
      cash: 12000 - games['18eu'].startingMoney[ctx.numPlayers] * ctx.numPlayers,
      trains: new Map(),
      minors: new Set<types.TMinorID>(games['18eu'].MinorInfo.keys()),
      shares: new Map(),
    },
    pool: {
      trains: new Map(),
      shares: new Map(),
    },
    minors: new Map(
      [...games['18eu'].MinorInfo.keys()].map((id) => [
        id,
        { id: id, owner: '', hasOperated: false, tokensLeft: 1, cash: 0, trains: new Map() },
      ]),
    ),
    corporations: new Map(
      [...games['18eu'].CorporationInfo.keys()].map((id) => [
        id,
        {
          id: id,
          president: '',
          initialPrice: -1,
          currentPrice: -1,
          incomeHistory: new Array(),
          hasOperated: false,
          tokensLeft: 1,
          cash: 0,
          trains: new Map(),
          shares: new Map(),
        },
      ]),
    ),
    priority: '0',
    tilesAvailable: new Map(games['18eu'].tiles.map((x) => [x[0].toString(), x[1]])),
    tilesPlaced: {},
    tokensPlaced: new Map(),
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
    },

    mcisrDiscountRound: {},
  },
};

function mcisrChooseMinor(G: IG, ctx: IGameCtx, choice: types.TMinorID) {
  if (G.minors.get(choice).owner != '' || !(choice in G.minors.keys())) return INVALID_MOVE;
  G.minorAuction = { minor: choice, auctioneer: ctx.currentPlayer, minBid: 100 };
  ctx.events.setPhase('mcisrStartAuction');
}

function mcisrStartAuctionStart(G: IG, ctx: IGameCtx, bid: types.TMoney) {
  if (bid < 100 || bid % 5 != 0) return INVALID_MOVE;
  G.minorAuction.passed = new Set();
  G.minorAuction.highBidder = ctx.currentPlayer;
  G.minorAuction.highBid = bid;
  ctx.events.setPhase('mcisrAuction');
}

function mcisrStartAuctionDecline() {}

function mcisrAuctionBid(G: IG, ctx: IGameCtx, bid: types.TMoney) {
  if (bid < G.minorAuction.highBid + 5 || bid % 5 != 0) return INVALID_MOVE;
  G.minorAuction.highBidder = ctx.currentPlayer;
  G.minorAuction.highBid = bid;
}

function mcisrAuctionPass(G: IG, ctx: IGameCtx) {
  G.minorAuction.passed.add(ctx.currentPlayer);
  if (G.minorAuction.passed.size == ctx.numPlayers - 1) {
    G.minors.get(G.minorAuction.minor).owner = ctx.currentPlayer;
    G.players[ctx.currentPlayer].minors.add(G.minorAuction.minor);
    G.minors[G.minorAuction.minor].trains[2].ctx.setPhase('');
  }
  //FIXME actually remove currentPlayer from turn playOrder somehow
}
