import * as utils from "../utils";
import * as actions from "../actions";

export default function soldierReducer(state = {}, action) {
  switch (action.type) {
    case actions.PREPARE_BATTLEFIELD: {
      const initialLocations = utils.initializeBattlefield();
      return Object.freeze({
        ...state,
        ...initialLocations,
      });
    }
    case actions.CYCLE: {
      const newSoldiersState = utils.getNewSoldiersState(state);
      return Object.freeze({
        ...state,
        ...newSoldiersState,
      });
    }
    // Add other Actions here
    default: {
      return state;
    }
  }
}
