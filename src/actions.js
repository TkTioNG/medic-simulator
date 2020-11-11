export const PREPARE_BATTLEFIELD = "PREPARE_BATTLEFIELD";
export const START_BATTLE = "START_BATTLE";
export const CYCLE = "CYCLE";
export const CALL_MEDIC = "CALL_MEDIC";
export const DISPATCH_MEDIC = "DISPATCH_MEDIC";
export const READY_TO_HEAL = "READY_TO_HEAL";
export const HEALING = "HEALING";
export const SOLDIER_HEALED = "SOLDIER_HEALED";
export const SOLDIER_SUCCESS = "SOLDIER_SUCCESS";

export function prepareBattlefield() {
  return {
    type: PREPARE_BATTLEFIELD,
  };
}
export function startBattle(cycle_count) {
  return {
    type: START_BATTLE,
    cycle_count: cycle_count,
  };
}

export function cycle(cycle_count) {
  return {
    type: CYCLE,
    cycle_count: cycle_count,
  };
}

export function callMedic(soldierId) {
  return {
    type: CALL_MEDIC,
    soldierId: soldierId,
  };
}

export function dispatchMedic(medicId, soldier) {
  return {
    type: DISPATCH_MEDIC,
    medicId: medicId,
    target: soldier,
  };
}

/* Healing process is break down to 3 phases, 
   ready to heal (initialize healing), 
   healing (healing process) and soldierHealed (heal success)*/
export function readyToHeal(medicId) {
  return {
    type: READY_TO_HEAL,
    medicId: medicId,
  };
}

export function healing(medicId) {
  return {
    type: HEALING,
    medicId: medicId,
  };
}

export function soldierHealed(medicId) {
  return {
    type: SOLDIER_HEALED,
    medicId: medicId,
  };
}

export function solderSuccess(soldierId) {
  return {
    type: SOLDIER_SUCCESS,
    soldierId: soldierId,
  };
}

/* Add other actions here, perhaps you will need something like "dispatchMedic"
soldierHealed to finish the project */
