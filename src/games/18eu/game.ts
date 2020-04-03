/*
 * Copyright 2020 Clarence "Sparr" Risher <sparr0@gmail.com>
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

export type TMoney = number;

interface IHasCash {
  cash: TMoney;
}

interface IHasMinors {
  minors: Set<IMinor>;
}

interface IHasShares {
  shares: Map<ICorporation, number>;
}

export type TTrainType = number | string;

interface IHasTrains {
  trains: Map<TTrainType, number>;
}

export interface IPlayer extends IHasCash, IHasMinors, IHasShares {
  id: number;
  name: string;
  presidencies: Set<ICorporation>;
}

export type TTokenLocation = ICompany | IMapHexGridPosition;

export interface ICompany extends IHasCash, IHasTrains {
  id: string;
  hasOperated: boolean;
  tokens: Array<TTokenLocation>;
}

export interface IMinor extends ICompany {
  owner: number;
}

export interface ICorporation extends ICompany, IHasShares {
  initialPrice: TMoney;
  currentPrice: TMoney;
  incomeHistory: Array<TMoney>;
}

export interface IBank extends IHasCash, IHasTrains, IHasMinors, IHasShares {}

export interface IPool extends IHasTrains, IHasShares {}

export type TImage = Promise<string>;

export interface IMapHexGridPosition {
  row: string;
  col: number;
}

export interface IMapHexLocation extends IMapHexGridPosition {
  place?: number; // for tiles with multiple disconnected groups of token slots
}

export interface IG {
  // game state
  players: Array<IPlayer>;
  minors: Array<IMinor>;
  corporations: Array<ICorporation>;
  turnOrder: Array<IPlayer>;
  priority: IPlayer;
}

export interface ITrainInfo {
  id: TTrainType;
  cost: number;
  name: string;
  art: TImage;
}

type ITrainInfoPartial = Omit<ITrainInfo, 'art'>;

let trainInfoArr: [number | string, ITrainInfoPartial][] = [
  [2, { id: 2, cost: 100, name: 'Wien-Raab-Bahn Norris 4-2-0 "Philadelphia" (1838)' }],
  [3, { id: 3, cost: 200, name: 'French C.-F. du Nord Crampton 4-2-0 (1846)' }],
  [4, { id: 4, cost: 300, name: 'Italian S.F.A.I. "Vittorio Emanuele II" 4-6-0 (1884)' }],
  [5, { id: 5, cost: 500, name: 'Austrian K.K.-Bahn Gölsdorf 2-8-0 (1897)' }],
  [6, { id: 6, cost: 600, name: "French C-F de l'Est Compound 4-8-2 (1930)" }],
  [8, { id: 8, cost: 800, name: 'Deutsche Reichsbahn Type 50 2-10-0 (1938)' }],
  ['P', { id: 'P', cost: 100, name: 'Pullman' }],
];

var TrainInfo: Map<TTrainType, ITrainInfo>;

(TrainInfo as Map<TTrainType, ITrainInfoPartial>) = new Map(trainInfoArr);

for (let [key, value] of TrainInfo) {
  value.art = import('./media/cardart/train_' + key + '.png');
}

export { TrainInfo };

export type Color = string;

export interface ICorporationInfo {
  id: string;
  name: string;
  english: string;
  colors: Array<Color>;
  art: TImage;
  tokenImage: TImage;
}

type ICorporationInfoPartial = Omit<ICorporationInfo, 'art' | 'tokenImage'>;

var CorporationInfo: Map<string, ICorporationInfo>;

(CorporationInfo as Map<string, ICorporationInfoPartial>) = new Map([
  [
    'bnrc',
    {
      id: 'bnrc',
      name: 'Société Nationale des Chemins de Fer Belges',
      english: 'Belgian National Railways Corporation',
      colors: ['#ffcc00', '#006633'],
    },
  ],
  [
    'dr',
    {
      id: 'dr',
      name: 'Nederlandsche Spoorwegen',
      english: 'Dutch Railways',
      colors: ['#003399', '#ffff00'],
    },
  ],
  [
    'rbsr',
    {
      id: 'rbsr',
      name: 'Königlich-Bayerische Staatseisenbahn',
      english: 'Royaal Bavarian State Railway',
      colors: ['#99ffff', '#99ffff'],
    },
  ],
  [
    'rpra',
    {
      id: 'rpra',
      name: 'Königlich-Preussische Eisenbahn-Verwaltung',
      english: 'Royal Prussian Railway Administration',
      colors: ['#22b6f0', '#000000'],
    },
  ],
  [
    'airsr',
    {
      id: 'airsr',
      name: 'Kaiserlich-Königliche Österreichische Staatsbahn',
      // english: "Imperial and Royal Austrian State Railway", // from Rules
      english: 'Austrian Imperial Royal State Railway', // from Charter
      colors: ['#ffff00', '#000000'],
    },
  ],
  [
    'isr',
    {
      id: 'isr',
      name: 'Ferrovie dello Stato',
      english: 'Italian State Railways',
      colors: ['#ff0000', '#00ff00'],
    },
  ],
  [
    'fnrc',
    {
      id: 'fnrc',
      name: 'Société Nationale des Chemins de Fer Français',
      english: 'French National Railways Corporation',
      colors: ['#ff0000', '#0000ff'],
    },
  ],
  [
    'gsr',
    {
      id: 'gsr',
      name: 'Deutsche Reichsbahn',
      english: 'German State Railway',
      colors: ['#ff0000', '#000000'],
    },
  ],
]);

for (let [key, value] of CorporationInfo) {
  value.art = import('./media/cardart/corp_' + key + '.png');
  value.tokenImage = import('./media/tokens/corp_' + key + '.png');
}

export { CorporationInfo };

export const EighteenEUGame = {
  name: '18eu',

  setup: () => ({
    cells: Array(9).fill(null),
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

  endIf: (G, ctx) => {
    if (G.cells.filter((c: any) => c === null).length === 0) {
      return { draw: true };
    }
  },
};
