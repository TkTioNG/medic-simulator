import soldierStatusEnum from "../enums/soldierStateEnum";
import medicStatusEnum from "../enums/medicStateEnum";
import * as settings from "../settings";
import { isMedicReached } from "../utils";

export const getInjuredSoldiers = (state) => {
  /* Return an array of the IDs of injured soldiers */
  return Object.values(state.soldiers.soldiers)
    .filter(
      (soldier) =>
        soldier.status === soldierStatusEnum.INJURED && !soldier.called
    )
    .map((soldierObj) => soldierObj.id);
};

export const getSuccessSoldiers = (state) => {
  /* Return an array of the IDs of injured soldiers */
  return Object.values(state.soldiers.soldiers)
    .filter((soldier) => soldier.coordinates.x >= settings.GRID_LENGTH)
    .map((soldierObj) => soldierObj.id);
};

// Returns array of healthy soldier Ids
export const getHealthySoldier = (state) =>
  Object.values(state.soldiers.soldiers)
    .filter((soldier) => soldier.status >= settings.GRID_LENGTH)
    .map((soldierObj) => soldierObj.id);

// A Selector for soldier given an ID
export const selectSoldier = (state, soldierId) => {
  return state.soldiers.soldiers[soldierId];
};

export const getSoldierOnField = (state) => {
  return Object.keys(state.soldiers.soldiers).length;
};

// Return an array of available medics
export const getIdleMedics = (state) => {
  return Object.values(state.medics.medics)
    .filter((medic) => medic.status === medicStatusEnum.IDLE)
    .map((medicObj) => medicObj.id);
};

// Return an array of assigned medics
export const getAssignedMedics = (state) => {
  return Object.values(state.medics.medics).filter(
    (medic) =>
      medic.status === medicStatusEnum.ASSIGNED && isMedicReached(medic)
  );
};

// Add other selectors here
// A Selector for medic given an ID
export const selectMedic = (state, medicId) => {
  return state.medics.medics[medicId];
};

// Get current cycle count
export const getCycleCount = (state) => state.soldiers.cycle_count;

export const getBattleStatus = (state) => state.battle.isCycleStop;
