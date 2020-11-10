import { put, takeEvery, delay, all, select, call } from "redux-saga/effects";

import * as actions from "../actions";
import * as settings from "../settings";
import * as selectors from "./selectors";

function* handleCycle(action) {
  const successSoldiers = yield select(selectors.getSuccessSoldiers);

  if (successSoldiers.length) {
    for (let soldierId of successSoldiers) {
      console.log(soldierId);
      yield put(actions.solderSuccess(soldierId));
      // yield call(actions.solderSuccess, soldierId);
    }
  }

  const injuredSoldiers = yield select(selectors.getInjuredSoldiers);
  const idleMedics = yield select(selectors.getIdleMedics);

  if (injuredSoldiers.length && idleMedics.length) {
    for (let soldierId of injuredSoldiers) {
      yield put(actions.callMedic(soldierId));
      // yield call(actions.callMedic, soldierId);
    }
  }

  if (idleMedics.length < settings.MEDIC_NUMBER) {
    const assignedMedics = yield select(selectors.getAssignedMedics);
    for (let medic of assignedMedics) {
      if (
        medic.target &&
        medic.coordinates.x === medic.target.coordinates.x &&
        medic.coordinates.y === medic.target.coordinates.y
      ) {
        yield delay(settings.HEAL_CYCLE * settings.CYCLE_DELAY);
        yield put(actions.soldierHealed(medic.id));
      }
    }
  }

  if (action.cycle_count <= settings.CYCLE_LIMIT) {
    yield delay(settings.CYCLE_DELAY);
    yield put(actions.cycle(action.cycle_count + 1));
  }
}

function* watchBattle() {
  yield takeEvery(actions.START_BATTLE, handleCycle);
  yield takeEvery(actions.CYCLE, handleCycle);
}

function* callMedic(action) {
  const idleMedics = yield select(selectors.getIdleMedics);
  const target = yield select(selectors.selectSoldier, action.soldierId);
  if (idleMedics.length) {
    yield put(actions.dispatchMedic(idleMedics[0].id, target));
  }
}

function* watchCallMedic() {
  yield takeEvery(actions.CALL_MEDIC, callMedic);
}

export default function* soldierSaga() {
  yield all([
    watchBattle(),
    watchCallMedic(),
    // Add other watchers here
  ]);
}
