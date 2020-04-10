/**
 * A Hex is a basic map element in 18XX games
 * A MapHex represents a hex pre-printed on a game map
 * A Tile representes a placeable tile with track and/or other elements
 * Tiles are placed on top of other tiles or MapHexes in the game
 */

import * as types from './types';

// All the place-able tiles known
export interface TileList {
  [key: string]: Tile | MultiTile;
}

// All the pre-printed map hexes known
export interface MapHexList {
  [key: string]: MapHex | MultiMapHex;
}

export type HexID = string;

// 0-5 depend on map orientation
//  flat tops  are 0-5 N NE SE S SW NW
//  flat sides are 0-5 NE E SE SW W NW
export type HexDirection = 0 | 1 | 2 | 3 | 4 | 5;

// places a train might stop, cities and towns
type OptionalStops =
  | { stop?: never; stops?: never }
  | { stop: TileStopType; stops?: never }
  | { stop?: never; stops: Array<TileStopType> };

// The base Hex type are common features found on map hexes and track tiles
export type Hex = {
  // A tile might be known by different IDs in different databases
  id?: HexID;
  fwtwrID?: HexID; // http://www.fwtwr.com/18xx/tiles/index.asp
  bwsID?: HexID; // http://www.diogenes.sacramento.ca.us/18xx_net/tiles/index.htm
  gameIDs?: { [key: string]: HexID }; // keys are game names

  //TODO: extend TColor to include multi-color / striped tile backgrounds
  color: types.Color;
  border?: types.Color;

  // connections between two edges or locations on the tile
  connections?: Array<TileConnection>;

  // edge connections for this offboard location
  offboardConnections?: Array<number>;

  // named tiles include cities and other prominent locations
  // a named tile usually only goes one specific place on a map
  name?: string;

  // one or two letter combinations that identify where a tile fits
  // unlike a name, many boards have multiple hexes and tiles with the same letters
  letters?: string;

  // mountain, river, desert, other common features a hex might have
  icon?: string;

  // most often encountered in mountain and river hexes
  upgradeCost?: types.Money;

  // taken from online sources
  typicalUpgrades?: Array<HexID>;
} & OptionalStops;

// A pre-printed hex on the board
export type MapHex = Hex & OptionalRevenues;

// A placeable track tile
// so far there's nothing unique about these
export type Tile = Hex & {};

// Mexico City is one tile that is two hexes large
// Layout is specified by each hex in the multi having a list of directions to reach it from the first hex
// Each hex also has an orientation
// Example:
//  [[[],0,A],[[0],0,B],[[0,0],1,C],[[2],3,D]]
//  A is the origin hex, in default orientation
//  B is north of A, in default orientation
//  C is north+north of A, or north of B, rotated 60 degrees clockwise
//  D is southeast of A, rotated 180 degrees
export type MultiHex<T> = Array<[Array<HexDirection>, HexDirection, T]>;
export type MultiMapHex = MultiHex<MapHex>;
export type MultiTile = MultiHex<Tile>;

// A connection goes from one position to another
// positions 0-5 are the edges of the tile
// positions 6+ are implicit junctions
// cities and towns are numbered -1, -2, ...
export type TileConnection = [number, number] | [number, number, TileConnectionMetadata];

// type:
//  standard is the most common track, and is implicit
//  narrow and dual gauge appear in some games as striped white/black/white/black track
//  ferry routes are red in some games
//  mountain pass appears in 1841
export type TileConnectionMetadata = { type?: string };

type OptionalRevenues =
| { revenue?: never; revenues?: never; }
| { revenue: number; revenueCondition?: string; revenueLabel?: string; revenues?: never; revenueConditions?: never; revenueLabels?: never }
| { revenue?: never; revenueCondition?: never; revenueLabel?: never; revenues: Array<number>; revenueConditions?: Array<string>; revenueLabels?: Array<string> };

/**
 * A place a train might visit, to earn revenue or otherwise
 */
export type TileStop = { name?: string; revenueSeparator?: string } & OptionalRevenues;

/**
 * A city is a place with space for token(s)
 */
export type TileCity = TileStop & { tokens: number; tokenLabels?: Array<string>; label?: string };

/**
 * A town is a place with no space for token(s)
 * style is for dots vs bars and other visual styles
 * variation are for gameplay altering things like a "halt"
 */
export type TileTown = TileStop & { style?: string; variation?: string; tokens?: never };

export type TileStopType = TileCity | TileTown;

//TODO support arbitrary art, vector or raster, on tiles, such as river on 1842 #316
