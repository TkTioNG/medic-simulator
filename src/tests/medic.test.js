import { call, delay, put, select } from "redux-saga/effects";

import * as soldierSagas from "../sagas/soldier";
import * as medicSagas from "../sagas/medic";
import * as selectors from "../sagas/selectors";
import * as actions from "../actions";
import { getClosest } from "../utils";
import * as settings from "../settings";

it("handleHealingSoldier", () => {
  const payload = {
    medicId: 1,
  };

  const gen = medicSagas.handleHealingSoldier(payload);

  expect(gen.next().value).toEqual(
    delay(settings.HEAL_CYCLE * settings.CYCLE_DELAY)
  );
  expect(gen.next().value).toEqual(put(actions.soldierHealed(payload.medicId)));
  expect(gen.next().done).toBeTruthy();
});

describe("handleCallMedic", () => {
  const payload = {
    soldierId: 1,
  };
  const soldier = {
    coordinates: { x: 0, y: 0 },
  };

  it("Medics should not be dispatched when there is no idle medic", () => {
    const gen = medicSagas.handleCallMedic(payload);
    expect(gen.next().value).toEqual(select(selectors.getIdleMedics));
    expect(gen.next([]).done).toBeTruthy(); // Mock empty arr as no idle medics
  });

  it(`The number of selectMedics being selected should be the same as the 
       number of idle medics`, () => {
    const medics = [0, 1, 2];

    const medicsArray = [
      { coordinates: { x: 5, y: 5 } },
      { coordinates: { x: 4, y: 4 } },
      { coordinates: { x: 0, y: 1 } },
    ];

    const gen = medicSagas.handleCallMedic(payload);

    expect(gen.next().value).toEqual(select(selectors.getIdleMedics));
    expect(gen.next(medics).value).toEqual(
      select(selectors.selectSoldier, payload.soldierId)
    );

    /* Medics should be selected for three times as there are three idle medics */
    expect(gen.next(soldier).value).toEqual(
      select(selectors.selectMedic, medics[0])
    );
    expect(gen.next(medicsArray[0]).value).toEqual(
      select(selectors.selectMedic, medics[1])
    );
    expect(gen.next(medicsArray[1]).value).toEqual(
      select(selectors.selectMedic, medics[2])
    );
    expect(gen.next(medicsArray[2]).value).toEqual(
      call(getClosest, soldier, medicsArray)
    );

    // Retrieve the closest medic
    const closest = getClosest(soldier, medicsArray);
    expect(gen.next(closest).value).toEqual(
      put(actions.dispatchMedic(medics[2], soldier)) // Third medics should be selected
    );
    expect(gen.next().done).toBeTruthy();
  });
});

/* Only concern with the action callMedics */
describe("Call Medics", () => {
  let gen = soldierSagas.handleCycle();
  beforeEach(() => {
    gen = soldierSagas.handleCycle();
    gen.next(); // select(selectors.getSuccessSoldiers)
  });

  it("Call medics when there is injured soldiers", () => {
    expect(gen.next([]).value).toEqual(select(selectors.getInjuredSoldiers));
    const injuredSoldiers = [0, 1, 2];
    const idleMedic = [0];
    expect(gen.next(injuredSoldiers).value).toEqual(
      select(selectors.getIdleMedics)
    );
    // Each injured soldier will call medic once
    expect(gen.next(idleMedic).value).toEqual(put(actions.callMedic(0)));
    expect(gen.next().value).toEqual(put(actions.callMedic(1)));
    expect(gen.next().value).toEqual(put(actions.callMedic(2)));
    // Proceed to next phases
    expect(gen.next().value).toEqual(select(selectors.getAssignedMedics));
  });

  it("Do not call medics when there is no idle medic", () => {
    expect(gen.next([]).value).toEqual(select(selectors.getInjuredSoldiers));
    const injuredSoldiers = [0, 1, 2];
    const idleMedic = [];
    expect(gen.next(injuredSoldiers).value).toEqual(
      select(selectors.getIdleMedics)
    );
    // Proceed to next phases
    expect(gen.next(idleMedic).value).toEqual(
      select(selectors.getAssignedMedics)
    );
  });

  it("Do not call medics when there is no injured soldier", () => {
    expect(gen.next([]).value).toEqual(select(selectors.getInjuredSoldiers));
    const injuredSoldiers = [];
    const idleMedic = [];
    expect(gen.next(injuredSoldiers).value).toEqual(
      select(selectors.getIdleMedics)
    );
    // Proceed to next phases
    expect(gen.next(idleMedic).value).toEqual(
      select(selectors.getAssignedMedics)
    );
  });
});

/* Only concern with the condition of healing the soldier */
describe("Heal Soldier", () => {
  let gen = soldierSagas.handleCycle();
  beforeEach(() => {
    gen = soldierSagas.handleCycle();
    /* Skipping previous action */
    gen.next(); // select(selectors.getSuccessSoldiers)
    gen.next([]); // select(selectors.getInjuredSoldiers)
    gen.next([]); // select(selectors.getIdleMedics)
  });

  it("Heal soldier if the medic has reached to the soldier", () => {
    /** predefined condition */
    const idleMedic = [2];
    const assignedMedic = [0, 1];
    const medics = {
      0: {
        id: 0,
        startHeal: false,
        coordinates: { x: 10, y: 10 },
        target: {
          coordinates: { x: 10, y: 10 },
        },
      },
      1: {
        id: 1,
        startHeal: false,
        coordinates: { x: 5, y: 5 },
        target: {
          coordinates: { x: 5, y: 5 },
        },
      },
    };

    expect(gen.next(idleMedic).value).toEqual(
      select(selectors.getAssignedMedics)
    );
    /* Execute healing phase twice */
    expect(gen.next(assignedMedic).value).toEqual(
      select(selectors.selectMedic, assignedMedic[0])
    );
    expect(gen.next(medics[assignedMedic[0]]).value).toEqual(
      put(actions.readyToHeal(medics[assignedMedic[0]].id))
    );
    expect(gen.next().value).toEqual(
      put(actions.healing(medics[assignedMedic[0]].id))
    );
    expect(gen.next().value).toEqual(
      select(selectors.selectMedic, assignedMedic[1])
    );
    expect(gen.next(medics[assignedMedic[1]]).value).toEqual(
      put(actions.readyToHeal(medics[assignedMedic[1]].id))
    );
    expect(gen.next().value).toEqual(
      put(actions.healing(medics[assignedMedic[1]].id))
    );
    // Proceed to next phase
    expect(gen.next().value).toEqual(select(selectors.getSoldierOnField));
  });

  it(`Do not heal soldier if the medic has not reached to the soldier 
      or is currently healing him`, () => {
    const idleMedic = [2];
    const assignedMedic = [0, 1];
    const medics = {
      0: {
        // Haven't reach to the soldier
        id: 0,
        startHeal: false,
        coordinates: { x: 10, y: 10 },
        target: {
          coordinates: { x: 5, y: 5 },
        },
      },
      1: {
        // Currently healing the soldiers
        id: 1,
        startHeal: true,
        coordinates: { x: 5, y: 5 },
        target: {
          coordinates: { x: 5, y: 5 },
        },
      },
    };

    expect(gen.next(idleMedic).value).toEqual(
      select(selectors.getAssignedMedics)
    );
    /* Check the condition twice but do not heal the soldier */
    expect(gen.next(assignedMedic).value).toEqual(
      select(selectors.selectMedic, assignedMedic[0])
    );
    expect(gen.next(medics[assignedMedic[0]]).value).toEqual(
      select(selectors.selectMedic, assignedMedic[1])
    );
    // Proceed to next phase
    expect(gen.next(medics[assignedMedic[1]]).value).toEqual(
      select(selectors.getSoldierOnField)
    );
  });

  it(`Do not heal soldier if there has no assigned medic`, () => {
    const idleMedic = [0, 1, 2];

    // Proceed to next phase directly
    expect(gen.next(idleMedic).value).toEqual(
      select(selectors.getSoldierOnField)
    );
  });
});
