import { take, put, takeEvery, all, delay, select } from "redux-saga/effects";

import * as actions from "../actions";
import * as selectors from "./selectors";
import * as settings from "../settings";

function* handleCycle() {
  yield delay(settings.CYCLE_DELAY);

  const isCycleStop = yield select(selectors.getBattleStatus);
  if (isCycleStop) {
    yield take(actions.RESUME_BATTLE);
  }

  // Exit if over cycle limit or all the soldier has crossed the battlefield
  const numOfSoldiers = yield select(selectors.getSoldierOnField);
  const cycle_count = yield select(selectors.getCycleCount);
  if (cycle_count <= settings.CYCLE_LIMIT && numOfSoldiers) {
    yield put(actions.cycle());
  }
}

function* watchBattle() {
  yield takeEvery(actions.START_BATTLE, handleCycle);
  yield takeEvery(actions.CYCLE, handleCycle);
}

export default function* soldierSaga() {
  yield all([
    watchBattle(),
    // Add other watchers here
  ]);
}
