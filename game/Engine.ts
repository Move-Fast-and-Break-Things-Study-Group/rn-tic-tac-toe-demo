// игровой движок (game engine)
// - хранить состояние (state)
// - позволяеть его читать
//
// возможность двум «игрокам» взаимодействовать с движком:
// - читать состояние игры
// - делать ход
// - получать уведомление о том, что ход сделал соперник
// - получать информацию об ошибке/о конце игры/победе/поражении
// - ошибки: попытка сделать запрещённый ход (можем пока ошибки не делать)н

// Движок
// а) уведомлять игрока о том, что наступила его очередь ходить
// б) позволять сделать ход
// в) предоставлять игроку доступ к состоянию игры (к игровой «доске»)

/**
 * [
 *  [O, X, O],
 *  [ ,  ,  ],
 *  [ , X, O],
 * ]
 */

export enum Cell {
  Empty,
  X,
  O,
}

export type State = Cell[][];

type MakeMoveFn = (x: number, y: number) => void;

type OnMoveFn = (state: State, whoAmI: Cell.X | Cell.O, makeMove: MakeMoveFn) => void;

type PlayerSide = Cell.X | Cell.O | 'random';

export default class Engine {
  private state: State;
  private onPlayerXMove: OnMoveFn;
  private onPlayerOMove: OnMoveFn;

  constructor(onPlayerOneMove: OnMoveFn, onPlayerTwoMove: OnMoveFn, playerOneSide: PlayerSide = Cell.X) {
    this.state = [
      [Cell.Empty, Cell.Empty, Cell.Empty],
      [Cell.Empty, Cell.Empty, Cell.Empty],
      [Cell.Empty, Cell.Empty, Cell.Empty],
    ];

    if (playerOneSide === 'random') {
      const randomValue = Math.random();
      playerOneSide = randomValue > 0.5 ? Cell.X : Cell.O;
    }

    if (playerOneSide === Cell.X) {
      this.onPlayerXMove = onPlayerOneMove;
      this.onPlayerOMove = onPlayerTwoMove;
    } else {
      this.onPlayerXMove = onPlayerTwoMove;
      this.onPlayerOMove = onPlayerOneMove;
    }
  }

  getState(): State {
    return this.state;
  }

  startGame() {
    const playerXMakeMove = (x: number, y: number) => this.makeMove(Cell.X, x, y);
    this.onPlayerXMove(this.state, Cell.X, playerXMakeMove);
  }

  private makeMove(type: Cell.X | Cell.O, x: number, y: number) {
    if (this.state[x][y] !== Cell.Empty) {
      throw new Error('Нельзя сделать ход в уже занятую клетку');
    }

    this.state[x][y] = type;

    if (type === Cell.X) {
      const playerOMakeMove = (x: number, y: number) => this.makeMove(Cell.O, x, y);
      this.onPlayerOMove(this.state, Cell.O, playerOMakeMove);
    } else {
      const playerXMakeMove = (x: number, y: number) => this.makeMove(Cell.X, x, y);
      this.onPlayerXMove(this.state, Cell.X, playerXMakeMove);
    }
  }
}
