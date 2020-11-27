import { all } from "redux-saga/effects";
import battleSaga from "./battle";
import soldierSaga from "./soldier";
import medicSaga from "./medic";

export default function* rootSaga() {
  yield all([
    soldierSaga(),
    battleSaga(),
    medicSaga(),
    // Add sagas here
  ]);
}
