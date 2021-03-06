export interface Player {
  playerID: number;
  teamID: null | number;
  isSpymaster: boolean;
}

export interface Team {
  teamID: number;
  players: Player[];
  spymaster: null | Player;
  start: boolean;
}

export enum CardColor {
  civilian = 'civilian',
  blue = 'blue',
  red = 'red',
  assassin = 'assassin',
}

export interface Card {
  word: string;
  color: CardColor;
  revealed: boolean;
}

export interface IG {
  players: Player[];
  teams: Team[];
  cards: Card[];
}

export enum Phases {
  lobby = 'lobby',
  play = 'play',
}

export enum Stages {
  chooseTeam = 'chooseTeam',
  giveClue = 'giveClue',
  guess = 'guess',
}
