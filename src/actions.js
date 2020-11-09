export const PREPARE_BATTLEFIELD = 'PREPARE_BATTLEFIELD';
export const START_BATTLE = 'START_BATTLE';
export const CYCLE = 'CYCLE';
export const CALL_MEDIC = 'CALL_MEDIC';

export function prepareBattlefield() {
    return {
        type: PREPARE_BATTLEFIELD,
    };
}
export function startBattle() {
    return {
        type: START_BATTLE,
    };
}

export function cycle() {
    return {
        type: CYCLE,
    };
}

/* Add other actions here, perhaps you will need something like "dispatchMedic"
soldierHealed to finish the project */
