import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actions from "./actions";
import soldierStatusEnum from "./enums/soldierStateEnum";
import soldierLogo from "./images/soldier.png";
import injuredSoldierLogo from "./images/injuredSoldier1.jpg";
import medicLogo from "./images/medic.png";
import healingLogo from "./images/healing.png";
import "./App.css";
import * as settings from "./settings";

const App = (props) => {
  const {
    soldiers,
    medics,
    prepareBattlefield,
    startBattle,
    cycle_count,
    success_count,
  } = props;

  useEffect(() => {
    prepareBattlefield();
  }, [prepareBattlefield]);

  const handleClick = (e) => {
    startBattle(cycle_count);
  };

  return (
    <div className="App">
      <div
        className="finishing-line"
        style={{
          left: settings.GRID_LENGTH * 15,
          height: settings.GIRD_HEIGHT * 10,
        }}
      ></div>
      <button onClick={handleClick}> Start Battle!</button>
      <div>Success: {success_count}</div>
      <div>Cycle: {cycle_count}</div>
      {success_count >= 10 && (
        <h1 style={{ color: "limegreen" }}>
          Hooray! All the soldier has crossed the battlefield.
        </h1>
      )}
      {soldiers &&
        Object.values(soldiers).map((soldier) => (
          <div
            key={soldier.id}
            className="Logo-holder"
            style={{
              top: soldier.coordinates.y * 10,
              left: soldier.coordinates.x * 15,
              color: "red",
            }}
          >
            <img
              alt="soldierLogo"
              className="soldierLogo"
              src={
                soldier.status === soldierStatusEnum.HEALTHY
                  ? soldierLogo
                  : injuredSoldierLogo
              }
            />
            <span>{soldier.id + 1}</span>
          </div>
        ))}

      {medics &&
        Object.values(medics).map((medic) => (
          <div
            key={medic.id}
            className="Logo-holder"
            style={{
              top: medic.coordinates.y * 10 - 5,
              left: medic.coordinates.x * 15 - 5,
              color: "green",
            }}
          >
            <img alt="medicLogo" className="medicLogo" src={medicLogo} />
            <span>{medic.id + 1}</span>
            {medic.startHeal && (
              <img
                alt="healingLogo"
                className="healingLogo"
                src={healingLogo}
              />
            )}
          </div>
        ))}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    medics: state.soldiers.medics,
    soldiers: state.soldiers.soldiers,
    cycle_count: state.soldiers.cycle_count,
    success_count: state.soldiers.success_count,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      prepareBattlefield: actions.prepareBattlefield,
      startBattle: (cycle_count) => actions.startBattle(cycle_count),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
