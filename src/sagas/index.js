import { all } from 'redux-saga/effects';
import battleSaga from './battle';
import soldierSaga from './soldier';

export default function* rootSaga() {
    yield all([
        soldierSaga(),
        battleSaga(),
        // Add sagas here
    ]);
}
