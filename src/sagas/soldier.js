import { put, takeEvery, delay, all, select, call } from "redux-saga/effects";

import * as actions from "../actions";
import * as settings from "../settings";
import * as selectors from "./selectors";
import { getClosest } from "../utils";

export function* handleCycle(action) {
  const successSoldiers = yield select(selectors.getSuccessSoldiers);
  // Check if any soldier has succeeded
  if (successSoldiers.length > 0) {
    for (let soldierId of successSoldiers) {
      yield put(actions.solderSuccess(soldierId));
    }
  }

  const injuredSoldiers = yield select(selectors.getInjuredSoldiers);
  const idleMedics = yield select(selectors.getIdleMedics);

  if (injuredSoldiers.length > 0 && idleMedics.length > 0) {
    // Call medic based on first come first serve basis
    for (let soldierId of injuredSoldiers) {
      yield put(actions.callMedic(soldierId));
    }
  }

  if (idleMedics.length < settings.MEDIC_NUMBER) {
    const assignedMedics = yield select(selectors.getAssignedMedics);
    for (let medicId of assignedMedics) {
      const medic = yield select(selectors.selectMedic, medicId);
      if (
        medic.target &&
        !medic.startHeal &&
        medic.coordinates.x === medic.target.coordinates.x &&
        medic.coordinates.y === medic.target.coordinates.y
      ) {
        yield put(actions.readyToHeal(medic.id));
        yield put(actions.healing(medic.id));
      }
    }
  }
  // Exit if over cycle limit or all the soldier has crossed the battlefield
  const numOfSoldiers = yield select(selectors.getSoldierOnField);
  if (action.cycle_count <= settings.CYCLE_LIMIT && numOfSoldiers) {
    yield delay(settings.CYCLE_DELAY);
    yield put(actions.cycle(action.cycle_count + 1));
  }
}

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
  yield put(actions.soldierHealed(action.medicId));
}

function* watchBattle() {
  yield takeEvery(actions.START_BATTLE, handleCycle);
  yield takeEvery(actions.CYCLE, handleCycle);
}

function* watchCallMedic() {
  yield takeEvery(actions.CALL_MEDIC, handleCallMedic);
  yield takeEvery(actions.HEALING, handleHealingSoldier);
}

export default function* soldierSaga() {
  yield all([
    watchBattle(),
    watchCallMedic(),
    // Add other watchers here
  ]);
}
