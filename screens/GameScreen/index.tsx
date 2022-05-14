import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Engine from '../../game/Engine';
import GameBoard from './components/GameBoard';

export default function GameScreen() {
  const [engine] = useState(() => new Engine(() => {}, () => {}));

  return (
    <View>
      <Text>Game Screen</Text>
      <GameBoard
        state={engine.getState()}
        onCellPress={(x, y) => console.log('pressed', x, y)}
      />
    </View>
  );
}
