/*
 * Game info for 18EU
 * Details of Minor Companies, Corporations, Trains, etc
 */

import * as types from '../types';

export const name = "18EU"

export const currency = "£"

export const startingMoney = {2:750, 3:450, 4:350, 5:300, 6:250}

// Train types

export interface ITrainInfo {
  id: types.TTrainType;
  cost: types.TMoney;
  name: string;
  art?: types.TImage;
}

const trainInfoArr: [number | string, ITrainInfo][] = [
  [2, { id: 2, cost: 100, name: 'Wien-Raab-Bahn Norris 4-2-0 "Philadelphia" (1838)' }],
  [3, { id: 3, cost: 200, name: 'French C.-F. du Nord Crampton 4-2-0 (1846)' }],
  [4, { id: 4, cost: 300, name: 'Italian S.F.A.I. "Vittorio Emanuele II" 4-6-0 (1884)' }],
  [5, { id: 5, cost: 500, name: 'Austrian K.K.-Bahn Gölsdorf 2-8-0 (1897)' }],
  [6, { id: 6, cost: 600, name: "French C-F de l'Est Compound 4-8-2 (1930)" }],
  [8, { id: 8, cost: 800, name: 'Deutsche Reichsbahn Type 50 2-10-0 (1938)' }],
  ['P', { id: 'P', cost: 100, name: 'Pullman' }],
];

for (let trainInfo of trainInfoArr) {
  trainInfo[1].art = import('./media/cardart/train_' + trainInfo[1].id + '.png');
}

const TrainInfo: Map<types.TTrainType, ITrainInfo> = new Map(trainInfoArr);

for (let [key, value] of TrainInfo) {
  value.art = import('./media/cardart/train_' + key + '.png');
}

export { TrainInfo };

// Corporations

export interface ICorporationInfo {
  id: types.TCorporationID;
  name: string;
  english: string;
  colors: Array<types.TColor>;
  art?: types.TImage;
  tokenImage?: types.TImage;
}

const CorporationInfo: Map<types.TCorporationID, ICorporationInfo> = new Map([
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

// Minor Companies

export interface IMinorInfo {
  id: types.TMinorID;
  name: string;
}

// prettier-ignore
export const MinorInfo: Map<types.TMinorID, IMinorInfo> = new Map([
  [ 1, { id:  1, name: 'Chemin de Fer du Nord' }],
  [ 2, { id:  2, name: 'État Belge' }],
  [ 3, { id:  3, name: 'Paris-Lyon-Méditerranée' }],
  [ 4, { id:  4, name: 'Leipzig-Dresdner-Bahn' }],
  [ 5, { id:  5, name: 'Ferrovia Adriatica' }],
  [ 6, { id:  6, name: 'Kaiser-Ferdinand-Nordbahn' }],
  [ 7, { id:  7, name: 'Berlin-Potsdamer-Bahn' }],
  [ 8, { id:  8, name: 'Ungarisch Staatsbahn' }],
  [ 9, { id:  9, name: 'Berlin-Stettiner-Bahn' }],
  [10, { id: 10, name: 'Strade Ferrate Alta Italia' }],
  [11, { id: 11, name: 'Südbahn' }],
  [12, { id: 12, name: 'Hollandsche Maatschappik' }],
  [13, { id: 13, name: 'Ludwigsbahn' }],
  [14, { id: 14, name: 'Ligne Strasbourg-Bâle' }],
  [15, { id: 15, name: 'Grand Central' }],
]);

export const tiles = [
  /*Yellow*/ [3,8],[4,10],[7,4],[8,15],[9,15],[57,8],[58,14],[201,7],[202,9], 
  /*Green*/ [14,4],[15,4],[80,4],[81,4],[82,4],[83,4],[141,5],[142,4],[143,2],[144,2],[576,4],[577,4],[578,3],[579,3],[580,1],[581,2],
  /*Brown*/ [145,4],[146,5],[147,4],[544,3],[545,3],[546,3],[582,9],[583,1],[584,2],[611,8],
  /*Grey*/ [513,5],
];