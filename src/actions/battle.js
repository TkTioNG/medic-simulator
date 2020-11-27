import * as actionTypes from "./actionTypes";

export const prepareBattlefield = () => ({
  type: actionTypes.PREPARE_BATTLEFIELD,
});

export const startBattle = () => ({
  type: actionTypes.START_BATTLE,
});

export const stopBattle = () => ({
  type: actionTypes.STOP_BATTLE,
});

export const resumeBattle = () => ({
  type: actionTypes.RESUME_BATTLE,
});

export const cycle = () => ({
  type: actionTypes.CYCLE,
});

/* Add other actions here, perhaps you will need something like "dispatchMedic"
soldierHealed to finish the project */
