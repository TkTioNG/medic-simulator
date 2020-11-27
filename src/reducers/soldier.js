import * as utils from "../utils";
import * as actions from "../actions";
import soldierStatusEnum from "../enums/soldierStateEnum";
import * as battleActions from "../actions/battle";

const initialState = {
  cycle_count: 0,
  success_count: 0,
  soldiers: {},
  // medics: {},
};

export default function battleReducer(state = initialState, action) {
  switch (action.type) {
    case battleActions.PREPARE_BATTLEFIELD: {
      const initialLocations = utils.initializeBattlefield();
      return Object.freeze({
        ...state,
        ...initialLocations,
      });
    }
    // case actions.PREPARE_BATTLEFIELD: {
    //   const initialLocations = utils.initializeBattlefield();
    //   return Object.freeze({
    //     ...state,
    //     soldiers: initialLocations.soldiers,
    //   });
    // }
    case actions.CYCLE: {
      const newSoldiersState = utils.getNewSoldiersState(state);
      const new_cycle_count = state.cycle_count + 1;
      return Object.freeze({
        ...state,
        soldiers: newSoldiersState,
        cycle_count: new_cycle_count,
      });
    }
    case actions.DISPATCH_MEDIC: {
      // Update soldiers called, so it wouldn't call medic again in next cycle
      const soldiers = {
        ...state.soldiers,
        [action.target.id]: {
          ...state.soldiers[action.target.id],
          called: true,
        },
      };
      return Object.freeze({
        ...state,
        soldiers: soldiers,
      });
    }
    case actions.SOLDIER_HEALED: {
      // Update soldiers status after regeneration
      const soldiers = {
        ...state.soldiers,
        [action.soldierId]: {
          ...state.soldiers[action.soldierId],
          health: 100,
          status: soldierStatusEnum.HEALTHY,
          called: false,
        },
      };
      return Object.freeze({
        ...state,
        soldiers: soldiers,
      });
    }
    case actions.SOLDIER_SUCCESS: {
      const { [action.soldierId]: omit, ...newSoldiers } = state.soldiers;
      return {
        ...state,
        soldiers: newSoldiers,
        success_count: state.success_count + 1,
      };
    }
    // Add other Actions here
    default: {
      return state;
    }
  }
}
