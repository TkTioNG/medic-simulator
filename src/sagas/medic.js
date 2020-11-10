import { put, takeEvery, delay, all, select } from 'redux-saga/effects';

import * as actions from '../actions';
import * as settings from '../settings';
import * as selectors from './selectors';


function* handleCycle() {
    const injuredSoldiers = yield select(selectors.getInjuredSoldiers);
    /* Here you will have access to the soldiers that are currently injured
    so you can create a selector to look for appropriate medics, then create an
    action to dispatch medics to specific soldiers
     */

    yield delay(settings.CYCLE_DELAY);
    yield put(actions.cycle());
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
