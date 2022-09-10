import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import Engine, { Cell, MakeMoveFn, OnMoveFn, State } from '../../game/Engine';
import { GameMode } from '../WelcomeScreen';
import GameBoard from './components/GameBoard';
import getNetworkPlayer, { useNetworkGame } from './players/onNetworkPlayer';

function getEndgameText(winner: Cell): string {
  if (winner === Cell.Empty) {
    return 'It\'s a draw!';
  } else {
    return `${winner === Cell.X ? 'X' : 'O'} wins!`; 
  }
}

const onBotMove: OnMoveFn = (state, whoAmI, makeMove, winner) => {
  if (winner !== undefined) {
    return;
  }

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

interface GameScreenProps {
  mode: GameMode;
}

export default function GameScreen({ mode }: GameScreenProps) {
  const [currentPlayerMakeMove, setCurrentPlayerMakeMove] = useState<MakeMoveFn>();
  const [currentPlayer, setCurrentPlayer] = useState<Cell.X | Cell.O>();
  const [currentState, setCurrentState] = useState<State>();
  const [winner, setWinner] = useState<Cell>();
  const {
    data: initialNetworkGameState,
    isLoading: isNetworkGameLoading,
    isError: isNetworkGameError,
    error: networkGameError
  } = useNetworkGame(mode === 'pvponline');

  console.log(
    'initialNetworkGameState',
    initialNetworkGameState,
    isNetworkGameLoading,
    isNetworkGameError,
    networkGameError
  );

  const onPlayerMove: OnMoveFn = (state, whoAmI, makeMove, winner) => {
    setCurrentState(state);
    setCurrentPlayer(whoAmI);
    setCurrentPlayerMakeMove(() => makeMove);
    setWinner(winner);
  };

  const [engine, setEngine] = useState(() => {
    if (mode === 'pvponline') {
      return;
    }
    const playerTwo = mode === 'pvplocal' ? onPlayerMove : onBotMove;
    return new Engine(onPlayerMove, playerTwo, 'random');
  });

  useEffect(() => {
    if (!engine) return;

    engine.startGame();
    setCurrentState(engine.getState());
  }, [engine]);

  useEffect(() => {
    if (!initialNetworkGameState) return;

    setEngine(new Engine(
      onPlayerMove,
      getNetworkPlayer(initialNetworkGameState.playerId),
      initialNetworkGameState.messages[0]?.type === 'first-move' ? Cell.X : Cell.O,
    ));
  }, [initialNetworkGameState]);

  const onCellPress = (x: number, y: number) => {
    try {
      currentPlayerMakeMove?.(x, y);
      setCurrentState(engine?.getState());
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Некорректный ход', err.message || err.toString());
      } else {
        Alert.alert('Некорректный ход', 'неожиданная ошибка');
      }
    }
  };

  return (
    <View>
      <Text>Game Screen</Text>
      {winner === undefined
        ? <Text>{currentPlayer === Cell.X ? 'X' : 'O'}, it's your move!</Text>
        : <Text>{getEndgameText(winner)}</Text>
      }
      {currentState
        ? <GameBoard state={currentState} onCellPress={onCellPress} />
        : <Text>Loading...</Text>
      }
    </View>
  );
}
