import Koa from 'koa';
import Router from '@koa/router';
import { v4 as uuidv4 } from 'uuid';
import { Cell, State } from '../mobile-app/game/Engine';

const app = new Koa();
const router = new Router();

const players: Record<string, string> = {};
/*
{
  'player1': 'player2',
  'player2': 'player1',
}
 */

const playersQueue: string[] = [];

router.post('/register', ctx => {
  const newPlayerId = uuidv4();

  playersQueue.push(newPlayerId);

  ctx.body = newPlayerId;
});

interface PendingServerState {
  status: 'pending';
  isItMyTurn: false;
}

interface StartedServerState {
  status: 'started';
  state: State;
  whoAmI: Cell.X | Cell.O;
  isItMyTurn: boolean;
}

interface FinishedServerState {
  status: 'finished';
  state: State;
  whoAmI: Cell.X | Cell.O;
  isItMyTurn: false;
  winner: Cell.X | Cell.O;
}

type ServerState = PendingServerState | StartedServerState | FinishedServerState;

router.get('/state', ctx => {
  const state: ServerState = {
    status: 'pending',
    isItMyTurn: false,
  };

  ctx.body = state;
});

app.use(router.routes());
app.listen(3000);

// POST /register - регистрирует на сервере

// GET /state - возвращает состояние игры - доска, кто ходит

// POST /move - делает ход


// 1. Приложение А шлёт POST /register, сервер присваивает приложению А ID и запоминает его
// 2. Приложение Б шлёт POST /register, сервер присваивает приложению Б ID и запоминает его
// 3. Сервер устанавливает пару между приложением А и Б и создаёт игру (внутри себя)
// A. Приложение А и Б постоянно шлют GET /state раз в секунду, сервер возвращает доску и информацию о том, кто ходит
// 4. Сервер отвечает приложению А о том, что сейчас его ход
// Б. Приложение А позволяет игроку сделать ход и шлёт запрос POST /move с информацией о ходе
// 5. Сервер обновляет внутреннее состояние и начинает по-новому отвечать на запросы GET /state, которые шлют приложения
// 6. Сервер отвечает приложению Б о том, что сейчас его ход
// В. Приложение Б позволяет игроку сделать ход и шлёт запрос POST /move с информацией о ходе
