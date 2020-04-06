/**
 * A Hex is a basic map element in 18XX games
 * A MapHex represents a hex pre-printed on a game map
 * A Tile representes a placeable tile with track and/or other elements
 * Tiles are placed on top of other tiles or MapHexes in the game
 */

import { Flavor } from './nominal';
import * as types from './types';

// All the place-able tiles known
export interface TileList {
  [key: string]: Tile | MultiTile;
}

// All the pre-printed map hexes known
export interface MapHexList {
  [key: string]: MapHex | MultiMapHex;
}

// Utility types to allow singular or plural key and value(s)
type HasTowns = { town: TileTown; towns: never } | { town: never; towns: Array<TileTown> };
type HasCities = { city: TileCity; cities: never } | { city: never; cities: Array<TileCity> };

// Flavored types to provide assignment safety
export type HexID = Flavor<string, 'HexID'>;
export type PositionID = Flavor<number, 'PositionID'>;

// 0 is "here"
// 1-6 depend on map orientation
//  flat tops  are 1-6 N NE SE S SW NW
//  flat sides are 1-6 NE E SE SW W NW
export type HexDirection = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// The base Hex type are common features found on map hexes and track tiles
export type Hex = {
  // A tile might be known by different IDs in different databases
  id: HexID;
  fwtwrID?: HexID;
  bwsID?: HexID;
  altIDs?: {fwtwr: Array<HexID>; bws: Array<HexID>;};

  //TODO: extend TColor to include multi-color / striped tile backgrounds
  color: types.TColor;

  // connections between two edges of the tile
  edgeConnections?: Array<TileConnection>;

  // connections leading from an edge of the tile to an external destination
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
  upgradeCost?: types.TMoney;

  // taken from online sources
  typicalUpgrades?: Array<HexID>;
} & HasTowns &
  HasCities;

// A pre-printed hex on the board
export type MapHex = Hex & {
  // many such hexes with off-board connections have a list of values
  // and some labels for when those values apply
  values: Array<Number>;
  valueLabels?: Array<String>;
};

// A placeable track tile
// so far there's nothing unique about these
export type Tile = Hex & {};

// Mexico City is one tile that is two hexes large
// Layout is specified by each hex in the multi having a list of directions to reach it from the first hex
// Each hex also has an orientation
// Example:
//  [[[],1,A],[[1],1,B],[[1,1],2,C],[[3],4,D]]
//  A is the origin hex, in default orientation
//  B is north of A, in default orientation
//  C is north+north of A, or north of B, rotated 60 degrees clockwise
//  D is southeast of A, rotated 180 degrees
export type MultiHex<T> = Array<[Array<HexDirection>, HexDirection, T]>;
export type MultiMapHex = MultiHex<MapHex>;
export type MultiTile = MultiHex<Tile>;

// A connection between tile edges can specify just the two edges
// or it can specify that plus some metadata about the connection
// the number can also be 0 to indicate the middle of the hex
export type TileConnection = [number, number] | [number, number, TileConnectionMetadata];

// type:
//  standard is the most common track
//  narrow and dual gauge appear in some games as striped white/black/white/black track
//  ferry routes are red in some games
//  mountain pass appears in 1841
// connections can also have towns or cities along them
//  given in order from the start to the end position of the connection
export type TileConnectionMetadata = { type?: 'standard' | 'narrow' | 'dual' | 'ferry' | 'pass' } & HasTowns &
  HasCities;

// A stop can have connections not otherwise specified as a TileConnection above
// these are for connections that go from a stop to an edge, not edge to edge
export type TileStopConnection = number | { edge: number; data: TileConnectionMetadata };

type HasTileStopConnections =
  | {}
  | { connection: TileStopConnection; connections: never }
  | { connection: never; connections: Array<TileStopConnection> };

type HasValues =
  | { value: number; valueLabel?: string; values: never; valueLabels: never }
  | { value: never; valueLabel: never; values: Array<number>; valueLabels?: Array<string> };

export type TileStop = { name?: string; valueSeparator?: string; position?: number } & HasTileStopConnections &
  HasValues;

// tokenLabels will most often be used for company starting locations
export type TileCity = TileStop & { label?: string; tokens: number; tokenLabels?: Array<string> };

// variation can be used for a "halt" stop or other types in some games
export type TileTown = TileStop & { style?: 'dot' | 'bar'; variation?: string };

//TODO support arbitrary art, vector or raster, on tiles, such as river on 1842 #316
