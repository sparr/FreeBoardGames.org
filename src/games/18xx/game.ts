/*
 * Copyright 2020 Clarence "Sparr" Risher <sparr0@gmail.com>
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import * as info from './info';
import * as types from './types';
import { IGameCtx } from 'boardgame.io/core';

export interface IG {
  // game state
  players: Array<types.IPlayer>;
  bank: types.IBank;
  pool: types.IPool;
  minors: Map<types.TMinorID, types.IMinor>;
  corporations: Map<types.TCorporationID, types.ICorporation>;
  turnOrder: Array<types.TPlayerID>;
  priority: types.TPlayerID;
}

export const EighteenXXGame = {
  name: '18xx',

  setup: (ctx: IGameCtx): IG => ({
    players: Array<types.IPlayer>(ctx.numPlayers),
    bank: {
      cash: 12000,
      trains: new Map(),
      minors: new Set<types.TMinorID>(info.MinorInfo.keys()),
      shares: new Map(),
    },
    pool: {
      trains: new Map(),
      shares: new Map(),
    },
    minors: new Map(
      [...info.MinorInfo.keys()].map((id) => [
        id,
        { id: id, owner: -1, hasOperated: false, tokensLeft: 1, cash: 0, trains: new Map() },
      ]),
    ),
    corporations: new Map(
      [...info.CorporationInfo.keys()].map((id) => [
        id,
        {
          id: id,
          president: -1,
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
    turnOrder: [...Array(ctx.numPlayers).keys()],
    priority: 0,
  }),

  moves: {
    clickCell(G: any, ctx: any, id: number) {
      const cells = [...G.cells];

      if (cells[id] === null) {
        cells[id] = ctx.currentPlayer;
        return { ...G, cells };
      }
    },
  },

  turn: {
    moveLimit: 1,
  },

  endIf: (G) => {
    if (G.cells.filter((c: any) => c === null).length === 0) {
      return { draw: true };
    }
  },
};
