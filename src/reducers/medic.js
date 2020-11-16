import * as utils from "../utils";
import * as actions from "../actions";
import medicStatusEnum from "../enums/medicStateEnum";

const initialState = {
  medics: {},
};

export default function soldierReducer(state = initialState, action) {
  switch (action.type) {
    case actions.PREPARE_BATTLEFIELD: {
      const initialLocations = utils.initializeBattlefield();
      return Object.freeze({
        ...state,
        medics: initialLocations.medics,
      });
    }
    case actions.CYCLE: {
      const newMedicsState = utils.getNewMedicsState(state);
      return Object.freeze({
        ...state,
        medics: newMedicsState,
      });
    }
    case actions.DISPATCH_MEDIC: {
      // Update medic target and status
      const medics = {
        ...state.medics,
        [action.medicId]: {
          ...state.medics[action.medicId],
          target: action.target,
          status: medicStatusEnum.ASSIGNED,
          startHeal: false,
        },
      };
      return Object.freeze({
        ...state,
        medics: medics,
      });
    }
    case actions.READY_TO_HEAL: {
      const medics = {
        ...state.medics,
        [action.medicId]: {
          ...state.medics[action.medicId],
          startHeal: true,
        },
      };
      return {
        ...state,
        medics: medics,
      };
    }
    case actions.SOLDIER_HEALED: {
      const medics = {
        ...state.medics,
        [action.medicId]: {
          ...state.medics[action.medicId],
          target: null,
          status: medicStatusEnum.IDLE,
          startHeal: false,
        },
      };
      return Object.freeze({
        ...state,
        medics: medics,
      });
    }
    // Add other Actions here
    default: {
      return state;
    }
  }
}
