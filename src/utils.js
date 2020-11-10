import * as settings from "./settings";
import soldierStateEnum from "./enums/soldierStateEnum";
import medicStateEnum from "./enums/medicStateEnum";

export const initializeBattlefield = () => {
  /* Utility function to populate soldiers reducer after the app is initialized*/
  const soldiers = {};
  for (let i = 0; i < settings.SOLDIER_NUMBER; i++) {
    soldiers[i] = {
      id: i,
      health: 100,
      coordinates: {
        x: 0,
        y: (settings.GIRD_HEIGHT / settings.SOLDIER_NUMBER) * i,
      },
      status: soldierStateEnum.HEALTHY,
      called: false,
    };
  }
  const medics = {};
  for (let i = 0; i < settings.MEDIC_NUMBER; i++) {
    medics[i] = {
      id: i,
      coordinates: {
        x: 50,
        y: (settings.GIRD_HEIGHT / settings.MEDIC_NUMBER) * i,
      },
      status: medicStateEnum.IDLE,
      target: null,
    };
  }
  return { soldiers: soldiers, medics: medics };
};

/* A function to get the new state of all soldiers after a cycle */
export const getNewSoldiersState = (state) => {
  const newSoldiersState = {};
  const oldSoldiersState = state.soldiers;

  /* Don't change if the soldier has been injured */
  Object.values(oldSoldiersState).forEach((oldState) => {
    newSoldiersState[oldState.id] =
      oldState.status === soldierStateEnum.INJURED
        ? oldState
        : getNewSoldierState(oldState);
  });
  return newSoldiersState;
};

/* A function to get the new values of a single soldier after a cycle */
const getNewSoldierState = (oldState) => {
  /* Calculate new coordinates */
  const coordinates = getNewCoordinates(
    oldState.coordinates,
    settings.SOLDIER_STEP_SIZE
  );
  const newHealth =
    oldState.health -
    getRandomIntInclusive(
      settings.SOLDIER_MIN_HEALTH_DEGEN,
      settings.SOLDIER_MAX_HEALTH_DEGEN
    );
  /* Set injured status depending on health */
  return {
    id: oldState.id,
    coordinates:
      oldState.status === soldierStateEnum.INJURED
        ? oldState.coordinates
        : coordinates,
    health: oldState.status === soldierStateEnum.INJURED ? 0 : newHealth,
    status: newHealth > 0 ? soldierStateEnum.HEALTHY : soldierStateEnum.INJURED,
    called: false,
  };
};

/* A function to get the new coordinate of a single soldier after a cycle */
const getNewCoordinates = (oldCoordinates, stepSize) => {
  // Can only go forward (right)
  const newX = oldCoordinates.x + getRandomIntInclusive(0, stepSize);
  let newY = oldCoordinates.y;
  // Can go up, down or stay the same level
  switch (oldCoordinates.y) {
    case 0:
      newY = oldCoordinates.y + getRandomIntInclusive(0, stepSize);
      break;
    case settings.GIRD_HEIGHT - 1: {
      newY = oldCoordinates.y + getRandomIntInclusive(-stepSize, 0);
      break;
    }
    default: {
      newY = oldCoordinates.y + getRandomIntInclusive(-stepSize, +stepSize);
    }
  }

  return {
    x: newX,
    y:
      newY < 0
        ? 0
        : newY > settings.GIRD_HEIGHT
        ? settings.GIRD_HEIGHT - 1
        : newY, // prevent go out of the grid
  };
};

/* A function to get random integers including both limits */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

/* A function to get the new state of all medics after a cycle */
export const getNewMedicsState = (state) => {
  const newMedicsState = {};
  const oldMedicsState = state.medics;

  /* Don't change if the medic has been injured */
  Object.values(oldMedicsState).forEach((oldState) => {
    newMedicsState[oldState.id] =
      oldState.status === medicStateEnum.IDLE
        ? oldState
        : getNewMedicState(oldState);
  });
  return newMedicsState;
};

/* A function to get the new values of a single medic after a cycle */
const getNewMedicState = (oldState) => {
  /* Set injured status depending on health */
  return {
    id: oldState.id,
    coordinates:
      oldState.status === medicStateEnum.IDLE ||
      oldState.target == null ||
      oldState.target === undefined
        ? oldState.coordinates
        : getNewMedicCoordinates(
            oldState.coordinates,
            settings.MEDIC_STEP_SIZE,
            oldState.target
          ),
    status:
      oldState.target == null || oldState.target === undefined
        ? medicStateEnum.IDLE
        : medicStateEnum.ASSIGNED, //oldState.target == null ? medicStateEnum.IDLE :
    target: oldState.target,
  };
};

/* A function to get the new coordinate of a single medic after a cycle */
const getNewMedicCoordinates = (oldCoordinates, stepSize, target) => {
  // Can only go forward (left)
  // const newX = oldCoordinates.x + getRandomIntInclusive(0, stepSize);
  const targetX = target.coordinates.x;
  const targetY = target.coordinates.y;

  const newX =
    Math.abs(targetX - oldCoordinates.x) <= stepSize
      ? targetX
      : targetX < oldCoordinates.x
      ? oldCoordinates.x - getRandomIntInclusive(0, stepSize)
      : oldCoordinates.x + getRandomIntInclusive(0, stepSize);
  const newY =
    Math.abs(targetY - oldCoordinates.y) <= stepSize
      ? targetY
      : targetY < oldCoordinates.y
      ? oldCoordinates.y - getRandomIntInclusive(0, stepSize)
      : oldCoordinates.y + getRandomIntInclusive(0, stepSize);

  return {
    x: newX,
    y: newY,
  };
};

/* A function to get the Manhattan distance between two coordinates
   coord obj should be an object that has x, y properties {x:, y:,} */
const getManhattanDistance = (coordA, coordB) => {
  return Math.abs(coordA.x - coordB.x) + Math.abs(coordA.y - coordB.y);
};

export const getClosest = (hunter, preys) => {
  const distances = preys.map((prey) =>
    getManhattanDistance(hunter.coordinates, prey.coordinates)
  );
  return distances.indexOf(Math.min(...distances));
};

// You can add more utility functions here
