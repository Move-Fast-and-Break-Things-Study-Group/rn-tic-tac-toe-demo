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

type State = Cell[][];

type MakeMoveFn = (x: number, y: number) => void;

type OnMoveFn = (state: State, makeMove: MakeMoveFn) => void;

export default class Engine {
  private state: State;
  private onPlayerOneMove: OnMoveFn;
  private onPlayerTwoMove: OnMoveFn;

  constructor(onPlayerOneMove: OnMoveFn, onPlayerTwoMove: OnMoveFn) {
    this.state = [
      [Cell.Empty, Cell.Empty, Cell.Empty],
      [Cell.Empty, Cell.Empty, Cell.Empty],
      [Cell.Empty, Cell.Empty, Cell.Empty],
    ];

    this.onPlayerOneMove = onPlayerOneMove;
    this.onPlayerTwoMove = onPlayerTwoMove;
  }

  getState(): State {
    return this.state;
  }
}
