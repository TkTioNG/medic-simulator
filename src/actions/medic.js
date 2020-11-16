import * as actionTypes from "./actionTypes";

export function callMedic(soldierId) {
  return {
    type: actionTypes.CALL_MEDIC,
    soldierId: soldierId,
  };
}

export function dispatchMedic(medicId, soldier) {
  return {
    type: actionTypes.DISPATCH_MEDIC,
    medicId: medicId,
    target: soldier,
  };
}

/* Healing process is break down to 3 phases, 
   ready to heal (initialize healing), 
   healing (healing process) and soldierHealed (heal success)*/
export function readyToHeal(medicId) {
  return {
    type: actionTypes.READY_TO_HEAL,
    medicId: medicId,
  };
}

export function healing(medicId, soldierId) {
  return {
    type: actionTypes.HEALING,
    medicId: medicId,
    soldierId: soldierId,
  };
}

export function soldierHealed(medicId, soldierId) {
  return {
    type: actionTypes.SOLDIER_HEALED,
    medicId: medicId,
    soldierId: soldierId,
  };
}
