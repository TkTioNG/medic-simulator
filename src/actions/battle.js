export const PREPARE_BATTLEFIELD = 'PREPARE_BATTLEFIELD';
export const START_BATTLE = 'START_BATTLE';
export const CYCLE = 'CYCLE';

export const prepareBattlefield = () => ({
    type: PREPARE_BATTLEFIELD,
});
export const startBattle = () => ({
    type: START_BATTLE,
});

export const cycle = () => ({
    type: CYCLE,
});



/* Add other actions here, perhaps you will need something like "dispatchMedic"
soldierHealed to finish the project */
