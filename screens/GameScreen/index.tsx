import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Engine, { Cell, MakeMoveFn, OnMoveFn, State } from '../../game/Engine';
import { GameMode } from '../WelcomeScreen';
import GameBoard from './components/GameBoard';

function getEndgameText(winner: Cell): string {
  if (winner === Cell.Empty) {
    return 'It\'s a draw!';
  } else {
    return `${winner === Cell.X ? 'X' : 'O'} wins!`; 
  }
}

interface GameScreenProps {
  mode: GameMode;
}

export default function GameScreen({ mode }: GameScreenProps) {
  const [currentPlayerMakeMove, setCurrentPlayerMakeMove] = useState<MakeMoveFn>();
  const [currentPlayer, setCurrentPlayer] = useState<Cell.X | Cell.O>();
  const [currentState, setCurrentState] = useState<State>();
  const [winner, setWinner] = useState<Cell>();

  const onPlayerMove: OnMoveFn = (state, whoAmI, makeMove) => {
    setCurrentState(state);
    setCurrentPlayer(whoAmI);
    setCurrentPlayerMakeMove(() => makeMove);
  };

  const onBotMove: OnMoveFn = (state, whoAmI, makeMove) => {
    const emptyCells = [];
    for (let x = 0; x < Engine.BOARD_SIZE; x++) {
      for (let y = 0; y < Engine.BOARD_SIZE; y++) {
        if (state[x][y] === Cell.Empty) {
          emptyCells.push([x, y]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [x, y] = emptyCells[randomIndex];
    makeMove(x, y);
  };

  const onGameEnd = (winner: Cell) => {
    setWinner(winner);
  };

  const [engine] = useState(() => {
    const playerTwo = mode === 'pvplocal' ? onPlayerMove : onBotMove;

    return new Engine(
      onPlayerMove,
      playerTwo,
      onGameEnd,
      'random'
    );
  });

  useEffect(() => {
    engine.startGame();
    setCurrentState(engine.getState());
  }, [engine]);

  return (
    <View>
      <Text>Game Screen</Text>
      {winner === undefined
        ? <Text>{currentPlayer === Cell.X ? 'X' : 'O'}, it's your move!</Text>
        : <Text>{getEndgameText(winner)}</Text>
      }
      {currentState
        ? (
          <GameBoard
            state={currentState}
            onCellPress={(x, y) => currentPlayerMakeMove?.(x, y)}
          />
        )
        : <Text>Loading...</Text>
      }
    </View>
  );
}
