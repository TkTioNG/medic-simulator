import soldierStatusEnum from '../enums/soldierStateEnum';

export const getInjuredSoldiers = (state) => {
    /* Return an array of the IDs of injured soldiers */
    return Object.values(state.soldiers)
    .filter(soldier => soldier.status === soldierStatusEnum.INJURED)
    .map(soldierObj => soldierObj.id);
}

// A Selector for soldier given an ID
export const selectSoldier = (state, soldierId) => {
    return state[soldierId];
}

// Returns array of soldier Ids
export const getSoldierIds = (state) => Object.keys(state.soldiers)

// Add other selectors here
