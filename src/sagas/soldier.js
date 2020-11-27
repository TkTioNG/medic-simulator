import { put, takeEvery, all, select } from "redux-saga/effects";

import * as utils from "../utils";
import * as actions from "../actions";
import * as selectors from "./selectors";

import * as settings from "../settings";

function* handleCycle() {
  const successSoldiers = yield select(selectors.getSuccessSoldiers);
  // Check if any soldier has succeeded
  yield all(successSoldiers.map((id) => put(actions.soldierSuccess(id))));

  const injuredSoldiers = yield select(selectors.getInjuredSoldiers);
  const idleMedics = yield select(selectors.getIdleMedics);

  if (injuredSoldiers.length > 0 && idleMedics.length > 0) {
    // Call medic based on first come first serve basis
    // yield all(injuredSoldiers.map((id) => put(actions.callMedic(id))));
    for (let soldierId of injuredSoldiers) {
      yield put(actions.callMedic(soldierId));
    }
  }

  if (idleMedics.length < settings.MEDIC_NUMBER) {
    const assignedMedics = yield select(selectors.getAssignedMedics);

    for (let medic of assignedMedics) {
      yield put(actions.readyToHeal(medic.id));
      yield put(actions.healing(medic.id, medic.target.id));
    }
  }

  const healthySoldiers = yield select(selectors.getHealthySoldier);

  yield all(
    healthySoldiers.map((id) =>
      put(actions.moveSoldier(id, utils.generateCoordDelta()))
    )
  );
}

function* watchBattle() {
  yield takeEvery(actions.CYCLE, handleCycle);
}

export default function* soldierSaga() {
  yield all([
    watchBattle(),
    // Add other watchers here
  ]);
}
