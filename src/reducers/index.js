import { combineReducers } from "redux";

import soldierReducer from "./soldier";
import medicReducer from "./medic";

const rootReducer = combineReducers({
  soldiers: soldierReducer,
  medics: medicReducer,
  // Other reducers if needed
});

export default rootReducer;
