/*
 * Types, Aliases, Interfaces, etc
 */

import { Flavor } from './nominal';

export type TMoney = Flavor<number, 'TMoney'>; // cash
export type TQuantity = Flavor<number, 'TQuantity'>; // generic count or amount
export type TMinorID = Flavor<number, 'TMinorID'>; // minor company number
export type TCorporationID = Flavor<string, 'TCorporationID'>; // corporation acronym
export type TCompanyID = TMinorID | TCorporationID;
export type TTrainType = Flavor<number | string, 'TTrainType'>; // 2, 3, 4, 5, 6, 8, P
export type TPlayerID = Flavor<number, 'TPlayerID'>; // player number 0 through n-1
export type TPlayerName = Flavor<string, 'TPlayerName'>;
export type TPlaceID = Flavor<number, 'TPlaceID'>; // disconnected areas on a tile for city tokens

interface IHasCash {
  cash: TMoney;
}

interface IHasMinors {
  minors: Set<TMinorID>;
}

interface IHasShares {
  shares: Map<TCorporationID, TQuantity>;
}

interface IHasTrains {
  trains: Map<TTrainType, TQuantity>;
}

export interface IPlayer extends IHasCash, IHasMinors, IHasShares {
  id: TPlayerID;
  name: TPlayerName;
  presidencies: Set<TCorporationID>;
}

export interface ICompany extends IHasCash, IHasTrains {
  id: TCompanyID;
  hasOperated: boolean;
  tokensLeft: TQuantity;
}

export interface IMinor extends ICompany {
  id: TMinorID;
  owner: TPlayerID;
}

export interface ICorporation extends ICompany, IHasShares {
  id: TCorporationID;
  president: TPlayerID;
  initialPrice: TMoney;
  currentPrice: TMoney;
  incomeHistory: Array<TMoney>;
}

export interface IBank extends IHasCash, IHasTrains, IHasMinors, IHasShares {}

export interface IPool extends IHasTrains, IHasShares {}

export type TImage = Promise<string>;

export interface IMapLocation {
  row: string;
  col: number;
  place?: number; // for tiles with multiple disconnected groups of token slots
}

export type TColor = Flavor<string, 'TColor'>;
