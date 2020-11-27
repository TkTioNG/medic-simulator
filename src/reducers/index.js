import { combineReducers } from "redux";

import soldierReducer from "./soldier";
import medicReducer from "./medic";
import battleReducer from "./battle";

const rootReducer = combineReducers({
  battle: battleReducer,
  soldiers: soldierReducer,
  medics: medicReducer,
  // Other reducers if needed
});

export default rootReducer;
