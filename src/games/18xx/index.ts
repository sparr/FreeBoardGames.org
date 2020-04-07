import { GameMode } from 'components/App/Game/GameModePicker';
import EighteenEUThumbnail from './media/thumbnail.png';
import { IGameDef } from 'games';
import instructions from './instructions.md';

export const EighteenEUGameDef: IGameDef = {
  code: '18eu',
  name: '18EU',
  minPlayers: 2,
  maxPlayers: 6,
  imageURL: EighteenEUThumbnail,
  modes: [
    { mode: GameMode.OnlineFriend },
    { mode: GameMode.LocalFriend },
  ],
  description: 'A Century of Railroading in Europe from the 1830s to the 1930s',
  descriptionTag: '18EU 18XX rail game board game train game stock market economic trading',
  instructions: {
    videoId: 'gLF54WTjInk',
    text: instructions,
  },
  config: () => import('./config'),
};
