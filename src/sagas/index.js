import { all } from "redux-saga/effects";
import soldierSaga from "./soldier";

export default function* rootSaga() {
  yield all([
    soldierSaga(),
    // Add sagas here
  ]);
}
