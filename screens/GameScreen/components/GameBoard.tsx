import React from 'react';
import { Text } from 'react-native';
import { State } from '../../../game/Engine';

interface GameBoardProps {
  state: State;
}

export default function GameBoard({ state }: GameBoardProps) {
  return <Text>Ya Doska</Text>;
}
