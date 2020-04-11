import { GameMode } from 'components/App/Game/GameModePicker';
import EighteenXXThumbnail from './media/thumbnail.png';
import { IGameDef } from 'games';
import instructions from './instructions.md';

export const EighteenXXGameDef: IGameDef = {
  code: '18xx',
  name: '18XX',
  minPlayers: 2,
  maxPlayers: 6,
  imageURL: EighteenXXThumbnail,
  modes: [
    { mode: GameMode.OnlineFriend },
    { mode: GameMode.LocalFriend },
  ],
  description: '18XX games',
  descriptionTag: '18XX rail game board game train game stock market economic trading',
  instructions: {
    text: instructions,
  },
  config: () => import('./config'),
};
