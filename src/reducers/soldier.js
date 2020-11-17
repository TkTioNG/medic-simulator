import * as utils from "../utils";
import * as actions from "../actions";
import soldierStatusEnum from "../enums/soldierStateEnum";

const initialState = {
  cycle_count: 0,
  success_count: 0,
  soldiers: {},
  // medics: {},
};

export default function soldierReducer(state = initialState, action) {
  switch (action.type) {
    case actions.PREPARE_BATTLEFIELD: {
      const initialLocations = utils.initializeBattlefield();
      return Object.freeze({
        ...state,
        soldiers: initialLocations.soldiers,
      });
    }
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

// export default function soldierReducer(state = initialState, action) {
//   switch (action.type) {
//     case actions.PREPARE_BATTLEFIELD: {
//       const initialLocations = utils.initializeBattlefield();
//       return Object.freeze({
//         ...state,
//         soldiers: initialLocations.soldiers,
//         medics: initialLocations.medics,
//       });
//     }
//     case actions.CYCLE: {
//       const newSoldiersState = utils.getNewSoldiersState(state);
//       const newMedicsState = utils.getNewMedicsState(state);
//       const new_cycle_count = state.cycle_count + 1;
//       return Object.freeze({
//         ...state,
//         soldiers: newSoldiersState,
//         medics: newMedicsState,
//         cycle_count: new_cycle_count,
//       });
//     }
//     case actions.DISPATCH_MEDIC: {
//       // Update medic target and status
//       const medics = {
//         ...state.medics,
//         [action.medicId]: {
//           ...state.medics[action.medicId],
//           target: action.target,
//           status: medicStatusEnum.ASSIGNED,
//           startHeal: false,
//         },
//       };
//       // Update soldiers called, so it wouldn't call medic again in next cycle
//       const soldiers = {
//         ...state.soldiers,
//         [action.target.id]: {
//           ...state.soldiers[action.target.id],
//           called: true,
//         },
//       };
//       return Object.freeze({
//         ...state,
//         medics: medics,
//         soldiers: soldiers,
//       });
//     }
//     case actions.READY_TO_HEAL: {
//       const medics = {
//         ...state.medics,
//         [action.medicId]: {
//           ...state.medics[action.medicId],
//           startHeal: true,
//         },
//       };
//       return {
//         ...state,
//         medics: medics,
//       };
//     }
//     case actions.SOLDIER_HEALED: {
//       const healedSoldier = state.medics[action.medicId].target;
//       const medics = {
//         ...state.medics,
//         [action.medicId]: {
//           ...state.medics[action.medicId],
//           target: null,
//           status: medicStatusEnum.IDLE,
//           startHeal: false,
//         },
//       };
//       // Update soldiers status after regeneration
//       const soldiers = {
//         ...state.soldiers,
//         [healedSoldier.id]: {
//           ...state.soldiers[healedSoldier.id],
//           health: 100,
//           status: soldierStatusEnum.HEALTHY,
//           called: false,
//         },
//       };
//       return Object.freeze({
//         ...state,
//         medics: medics,
//         soldiers: soldiers,
//       });
//     }
//     case actions.SOLDIER_SUCCESS: {
//       const { [action.soldierId]: omit, ...newSoldiers } = state.soldiers;
//       return {
//         ...state,
//         soldiers: newSoldiers,
//         success_count: state.success_count + 1,
//       };
//     }
//     // Add other Actions here
//     default: {
//       return state;
//     }
//   }
// }
