/*
 * Types, Aliases, Interfaces, etc
 */

export type Money = number; // cash
export type Quantity = number; // generic count or amount
export type MinorID = number; // minor company number
export type CorporationID = string; // corporation acronym
export type CompanyID = MinorID | CorporationID;
export type TrainType = number | string; // 2, 3, 4, 5, 6, 8, P
export type PlayerID = string; // player number 0 through n-1, as strings
export type PlayerName = string;
export type Color = string;

interface HasCash {
  cash: Money;
}

interface HasMinors {
  minors: { [minorid: string]: true };
}

interface HasShares {
  shares: { [corpid: string]: Quantity };
}

interface HasTrains {
  trains: { [traintype: string]: Quantity };
}

export interface Player extends HasCash, HasMinors, HasShares {
  id: PlayerID;
  // name: TPlayerName;
  presidencies: { [corpid: string]: true };
}

export interface Company extends HasCash, HasTrains {
  id: CompanyID;
  hasOperated: boolean;
  tokensLeft: Quantity;
}

export interface Minor extends Company {
  id: MinorID;
  owner: PlayerID;
}

export type GridShape<T> = T[][];

export function gridGet<T>(grid: GridShape<T>, row: number, col: number, def: T) {
  if (row in grid && col in grid[row]) {
    return grid[row][col];
  } else {
    return def;
  }
}

export function gridSet<T>(grid: GridShape<T>, row: number, col: number, val: T) {
  if (!(row in grid)) {
    grid[row] = [];
  }
  grid[row][col] = val;
  return val;
}

export function gridDel<T>(grid: GridShape<T>, row: number, col: number) {
  if (row in grid && col in grid[row]) {
    delete grid[row][col];
    let empty = true;
    for (let index = 0; index < grid[row].length; index++) {
      if (index in grid[row]) {
        empty = false;
        break;
      }
    }
    if (empty) {
      delete grid[row]
    }
  }
}

export interface StockMarketSpaceData {
  value: Money;
  starting?: true;
}

export type StockMarketData = GridShape<StockMarketSpaceData>;

export interface StockMarketSpaceState {
  tokens?: [{ corpID: CorporationID; flipped: boolean }];
}

export type StockMarketState = GridShape<StockMarketSpaceState>;

export interface GridPosition {
  row: number;
  col: number;
  stack?: number;
}

export type StockMarketPosition = GridPosition;

export function stockValue(market: StockMarketData, pos: StockMarketPosition) {
  return market?.[pos.row]?.[pos.col].value;
}

export interface Corporation extends Company, HasShares {
  id: CorporationID;
  president: PlayerID;
  initialPrice: Money;
  hasFloated: boolean;
  currentStockMarketPosition: StockMarketPosition;
  revenueHistory: Array<Money>;
  dividendHistory: Array<Money>;
}

export interface Bank extends HasCash, HasTrains, HasMinors, HasShares {}

export interface Pool extends HasTrains, HasShares {}

export type Image = Promise<string>;

export interface MapPosition {
  row: string;
  col: number;
  place?: number; // places on a hex a thing can be, mostly token slots
}