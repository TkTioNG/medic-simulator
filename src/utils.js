import * as settings from './settings';
import soldierStateEnum from './enums/soldierStateEnum';

export const initializeBattlefield = () =>
{
    /* Utility function to populate soldiers reducer after the app is initialized*/
    const soldiers = {}
    for (var i = 0; i<settings.SOLDIER_NUMBER; i++) {
        soldiers[i] = {
            id: i,
            health: 100,
            coordinates: {
                x: 0,
                y: settings.GRID_LENGTH/settings.SOLDIER_NUMBER * i,
            },
            status: soldierStateEnum.HEALTHY,
        }
    }
    return soldiers;
}

/* A funciton to get the new state of all soldiers after a cycle */
export const getNewSoldiersState = (state) => {
    const newSoldiersState= {}
    const oldSoldiersState = state;
    
    /* Don't change if the soldier has been injured */
    Object.values(oldSoldiersState).forEach(oldState =>{
        newSoldiersState[oldState.id] = oldState.status === soldierStateEnum.INJURED ? oldState :  getNewSoldierState(oldState);
    })
    return newSoldiersState;
}

/* A function to get the new values of a single soldier after a cycle */
const getNewSoldierState = (oldState) => {
    /* Calculate new coordinates */
    const coordinates = getNewCoordinates(oldState.coordinates, settings.SOLDIER_STEP_SIZE);
    const newHealth = oldState.health - getRandomIntInclusive(
        settings.SOLDIER_MIN_HEALTH_DEGEN, 
        settings.SOLDIER_MAX_HEALTH_DEGEN
    );
    /* Set injured status depending on health */
    return {
        id: oldState.id,
        coordinates: oldState.status === soldierStateEnum.INJURED ? oldState.coordinates : coordinates,
        health: oldState.status === soldierStateEnum.INJURED ? 0 : newHealth,
        status: newHealth > 0 ? soldierStateEnum.HEALTHY : soldierStateEnum.INJURED,
    }
}

/* A function to get the new coordinate of a single soldier after a cycle */
const getNewCoordinates = (oldCoordinates, stepSize) => {
    // Can only go forward (left)
    const newX = oldCoordinates.x + getRandomIntInclusive(0, stepSize)
    let newY = oldCoordinates.y
    // Can go up, down or stay the same level
    switch (oldCoordinates.y) {
        case 0:
            newY = oldCoordinates.y + getRandomIntInclusive(0, stepSize);
            break
        case settings.GIRD_HEIGHT - 1: {
            newY = oldCoordinates.y + getRandomIntInclusive(-stepSize, 0);
            break
        }
        default: {
            newY = oldCoordinates.y + getRandomIntInclusive(-stepSize, +stepSize);
        }
    }
    
    return {
        x: newX,
        y: newY,
    }
}

/* A function to get random integers including both limits */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
  }

// You can add more utility functions here
