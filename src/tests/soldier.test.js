import { delay, put, select } from "redux-saga/effects";

import * as soldierSagas from "../sagas/soldier";
import * as selectors from "../sagas/selectors";
import * as actions from "../actions";
import * as settings from "../settings";

/* Only concern with the condition whether the soldier success or not */
describe("Soldier Success", () => {
  it("Dispatch action solderSuccess if there has soldiers succeeded", () => {
    const gen = soldierSagas.handleCycle();

    const successSoldier = [1, 2, 3, 4, 5]; // expected 5 soldier succeed

    expect(gen.next().value).toEqual(select(selectors.getSuccessSoldiers));
    expect(gen.next(successSoldier).value).toEqual(
      put(actions.soldierSuccess(1))
    );
    expect(gen.next().value).toEqual(put(actions.soldierSuccess(2)));
    expect(gen.next().value).toEqual(put(actions.soldierSuccess(3)));
    expect(gen.next().value).toEqual(put(actions.soldierSuccess(4)));
    expect(gen.next().value).toEqual(put(actions.soldierSuccess(5)));

    // Proceed to next stage
    expect(gen.next().value).toEqual(select(selectors.getInjuredSoldiers));
  });

  it("Do not dispatch solderSuccess if there has no soldier succeeded", () => {
    const gen = soldierSagas.handleCycle();

    const successSoldier = []; // expected no soldier succeed

    expect(gen.next().value).toEqual(select(selectors.getSuccessSoldiers));

    // Proceed to next stage
    expect(gen.next(successSoldier).value).toEqual(
      select(selectors.getInjuredSoldiers)
    );
  });
});

/* Only concern with the progress of each cycle */
describe("Handle Cycle", () => {
  it(`Continue to next cycle if cycle limit is not reached
       and there are still have soldier on the battlefield`, () => {
    const payload = {
      cycle_count: 10, // smaller than CYCLE_LIMIT (500)
    };
    const numOfSoldier = 5;
    const gen = soldierSagas.handleCycle(payload);
    /* Skipping previous action */
    gen.next(); // select(selectors.getSuccessSoldiers)
    gen.next([]); // select(selectors.getInjuredSoldiers)
    gen.next([]); //select(selectors.getIdleMedics)
    expect(gen.next([0, 1, 2]).value).toEqual(
      select(selectors.getSoldierOnField)
    );
    expect(gen.next(numOfSoldier).value).toEqual(delay(settings.CYCLE_DELAY));
    expect(gen.next().value).toEqual(
      put(actions.cycle(payload.cycle_count + 1))
    );
    expect(gen.next().done).toBeTruthy();
  });

  it(`Do not continue to next cycle if cycle limit is reached`, () => {
    const payload = {
      cycle_count: 501, // greater than CYCLE_LIMIT (500)
    };
    const numOfSoldier = 5;
    const gen = soldierSagas.handleCycle(payload);
    /* Skipping previous action */
    gen.next(); // select(selectors.getSuccessSoldiers)
    gen.next([]); // select(selectors.getInjuredSoldiers)
    gen.next([]); //select(selectors.getIdleMedics)
    expect(gen.next([0, 1, 2]).value).toEqual(
      select(selectors.getSoldierOnField)
    );
    expect(gen.next(numOfSoldier).done).toBeTruthy();
  });

  it(`Do not continue to next cycle if there is no soldier on field`, () => {
    const payload = {
      cycle_count: 10, // greater than CYCLE_LIMIT (500)
    };
    const numOfSoldier = 0;
    const gen = soldierSagas.handleCycle(payload);
    /* Skipping previous action */
    gen.next(); // select(selectors.getSuccessSoldiers)
    gen.next([]); // select(selectors.getInjuredSoldiers)
    gen.next([]); //select(selectors.getIdleMedics)
    expect(gen.next([0, 1, 2]).value).toEqual(
      select(selectors.getSoldierOnField)
    );
    expect(gen.next(numOfSoldier).done).toBeTruthy();
  });
});
