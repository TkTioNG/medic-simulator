import { put, takeEvery, delay, all, select } from "redux-saga/effects";

import * as actions from "../actions";
import * as settings from "../settings";
import * as selectors from "./selectors";
import { getClosest } from "../utils";

function* handleCycle(action) {
  const successSoldiers = yield select(selectors.getSuccessSoldiers);
  // Check if any soldier has succeeded
  if (successSoldiers.length) {
    for (let soldierId of successSoldiers) {
      yield put(actions.solderSuccess(soldierId));
      // yield call(actions.solderSuccess, soldierId);
    }
  }

  const injuredSoldiers = yield select(selectors.getInjuredSoldiers);
  const idleMedics = yield select(selectors.getIdleMedics);

  if (injuredSoldiers.length && idleMedics.length) {
    // Call medic based on first come first sev=rve basis
    for (let soldierId of injuredSoldiers) {
      yield put(actions.callMedic(soldierId));
      // yield call(actions.callMedic, soldierId);
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

function* watchBattle() {
  yield takeEvery(actions.START_BATTLE, handleCycle);
  yield takeEvery(actions.CYCLE, handleCycle);
}

function* callMedic(action) {
  const idleMedics = yield select(selectors.getIdleMedics);
  const target = yield select(selectors.selectSoldier, action.soldierId);
  // Dispatch first idle medic to the target (soldier)
  if (idleMedics.length) {
    const availableMedics = [];
    for (let idleMedic of idleMedics) {
      availableMedics.push(yield select(selectors.selectMedic, idleMedic));
    }
    // const availableMedics = idleMedics.map((medicId) => getMedic(medicId));
    // console.log(availableMedics);
    const closestMedic = getClosest(target, availableMedics);
    // console.log(closestMedic);
    yield put(actions.dispatchMedic(idleMedics[closestMedic], target));
  }
}

function* healingSoldier(action) {
  yield delay(settings.HEAL_CYCLE * settings.CYCLE_DELAY);
  yield put(actions.soldierHealed(action.medicId));
}

// function* dispatchMedic(action) {
//   const medic = yield select(selectors.selectMedic, action.medicId);
//   if (
//     medic.target &&
//     medic.coordinates.x === medic.target.coordinates.x &&
//     medic.coordinates.y === medic.target.coordinates.y
//   ) {
//     yield delay(settings.HEAL_CYCLE * settings.CYCLE_DELAY);
//     yield put(actions.soldierHealed(medic.id));
//   }
// }

function* watchCallMedic() {
  yield takeEvery(actions.CALL_MEDIC, callMedic);
  yield takeEvery(actions.HEALING, healingSoldier);
  // yield takeEvery(actions.DISPATCH_MEDIC, dispatchMedic);
}

export default function* soldierSaga() {
  yield all([
    watchBattle(),
    watchCallMedic(),
    // Add other watchers here
  ]);
}
