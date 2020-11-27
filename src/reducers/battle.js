import * as actions from "../actions";

const initialState = {
  isCycleStop: false,
};

export default function battleReducer(state = initialState, action) {
  switch (action.type) {
    case actions.STOP_BATTLE: {
      return Object.freeze({
        ...state,
        isCycleStop: true,
      });
    }
    case actions.RESUME_BATTLE:
    case actions.PREPARE_BATTLEFIELD: {
      return Object.freeze({
        ...state,
        isCycleStop: false,
      });
    }
    // Add other Actions here
    default: {
      return state;
    }
  }
}
