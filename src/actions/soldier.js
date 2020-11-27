import * as actionTypes from "./actionTypes";

export function prepareBattlefield() {
  return {
    type: actionTypes.PREPARE_BATTLEFIELD,
  };
}

export const moveSoldier = (id, coordDelta) => ({
  type: actionTypes.MOVE_SOLDIER,
  id,
  coordDelta,
});

export function callMedic(soldierId) {
  return {
    type: actionTypes.CALL_MEDIC,
    soldierId: soldierId,
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
