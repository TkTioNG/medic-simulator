import { put, takeEvery, all, select } from 'redux-saga/effects';

import * as utils from '../utils';
import * as soldierActions from '../actions/soldier';
import * as battleActions from '../actions/battle';
import * as selectors from './selectors';


function* handleCycle() {
    const soldierIds = yield select(selectors.getSoldierIds);
    
    yield all(soldierIds.map(id => put(soldierActions.moveSoldier(id, utils.generateCoordDelta()))))
}

function* watchBattle() {
    yield takeEvery(battleActions.CYCLE, handleCycle);
}

export default function* soldierSaga() {
    yield all([
        watchBattle(),
        // Add other watchers here
    ]);
}
