import { IGameConfig } from '../';
import { EighteenXXGame } from './game';
import { Board } from './board';

const config: IGameConfig = {
  bgioGame: EighteenXXGame,
  bgioBoard: Board,
  debug: true,
};

export default config;
