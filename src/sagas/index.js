import { all } from "redux-saga/effects";
import soldierSaga from "./soldier";
import medicSaga from "./medic";

export default function* rootSaga() {
  yield all([
    soldierSaga(),
    medicSaga(),
    // Add sagas here
  ]);
}
