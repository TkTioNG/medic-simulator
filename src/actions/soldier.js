import * as actionTypes from "./actionTypes";

export function prepareBattlefield() {
  return {
    type: actionTypes.PREPARE_BATTLEFIELD,
  };
}
export function startBattle(cycle_count) {
  return {
    type: actionTypes.START_BATTLE,
    cycle_count: cycle_count,
  };
}

export function cycle(cycle_count) {
  return {
    type: actionTypes.CYCLE,
    cycle_count: cycle_count,
  };
}

export function soldierSuccess(soldierId) {
  return {
    type: actionTypes.SOLDIER_SUCCESS,
    soldierId: soldierId,
  };
}

/* Add other actions here, perhaps you will need something like "dispatchMedic"
soldierHealed to finish the project */
