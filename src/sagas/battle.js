import { put, takeEvery, all, delay } from 'redux-saga/effects';

import * as battleActions from '../actions/battle';
import * as settings from '../settings';

function* handleCycle() {
  yield delay(settings.CYCLE_DELAY);
  yield put(battleActions.cycle());
}

function* watchBattle() {
  yield takeEvery(battleActions.START_BATTLE, handleCycle);
  yield takeEvery(battleActions.CYCLE, handleCycle);
}

export default function* soldierSaga() {
  yield all([
      watchBattle(),
      // Add other watchers here
  ]);
}
