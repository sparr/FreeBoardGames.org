/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import * as React from 'react';
import { IGameArgs } from 'components/App/Game/GameBoardWrapper';
import { map } from './games/18eu'

interface IBoardProps {
  G: any;
  ctx: any;
  moves: any;
  playerID: string;
  isActive: boolean;
  gameArgs?: IGameArgs;
  step?: any;
}

export class Board extends React.Component<IBoardProps, {}> {

  render() {
    let debug_out = <span><h1>G=</h1><pre>{JSON.stringify(this.props.G, null, 2)};</pre><h1>ctx=</h1><pre>{JSON.stringify(this.props.ctx, null, 2)};</pre></span>;
    return debug_out;
  };


}

export default Board;
