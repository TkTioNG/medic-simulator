import { put, takeEvery, delay, all, select, call } from "redux-saga/effects";

import * as actions from "../actions";
import * as settings from "../settings";
import * as selectors from "./selectors";
import { getClosest } from "../utils";

export function* handleCallMedic(action) {
  const idleMedics = yield select(selectors.getIdleMedics);
  // Dispatch first idle medic to the target (soldier)
  if (idleMedics.length > 0) {
    const target = yield select(selectors.selectSoldier, action.soldierId);
    // Retrieve all idle medics
    const availableMedics = [];
    for (let idleMedic of idleMedics) {
      availableMedics.push(yield select(selectors.selectMedic, idleMedic));
    }
    // Get closest medic to the soldier based on Manhattan distance
    const closestMedic = yield call(getClosest, target, availableMedics); // getClosest(target, availableMedics);
    yield put(actions.dispatchMedic(idleMedics[closestMedic], target));
  }
}

export function* handleHealingSoldier(action) {
  yield delay(settings.HEAL_CYCLE * settings.CYCLE_DELAY);
  yield put(actions.soldierHealed(action.medicId, action.soldierId));
}

function* watchCallMedic() {
  yield takeEvery(actions.CALL_MEDIC, handleCallMedic);
  yield takeEvery(actions.HEALING, handleHealingSoldier);
}

export default function* medicSaga() {
  yield all([
    watchCallMedic(),
    // Add other watchers here
  ]);
}
