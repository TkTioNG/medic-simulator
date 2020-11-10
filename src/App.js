import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actions from "./actions";
import soldierStatusEnum from "./enums/soldierStateEnum";
import soldierLogo from "./images/soldier.png";
import injuredSoldierLogo from "./images/injuredSoldier1.jpg";
import medicLogo from "./images/medic.png";
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
        style={{ left: settings.GRID_LENGTH * 15, height: settings.GIRD_HEIGHT * 10 }}
      ></div>
      <button onClick={handleClick}> Start Battle!</button>
      <div>Success: {success_count}</div>
      <div>Cycle: {cycle_count}</div>
      {soldiers &&
        Object.values(soldiers).map((soldier) => (
          <div>
            <img
              key={soldier.id}
              alt="soldierLogo"
              className="soldierLogo"
              src={
                soldier.status === soldierStatusEnum.HEALTHY
                  ? soldierLogo
                  : injuredSoldierLogo
              }
              style={{
                position: "absolute",
                top: soldier.coordinates.y * 10,
                left: soldier.coordinates.x * 15,
              }}
            />
            <span
              style={{
                position: "absolute",
                top: soldier.coordinates.y * 10 - 5,
                left: soldier.coordinates.x * 15 - 5,
                color: "red",
              }}
            >
              {soldier.id + 1}
            </span>
          </div>
        ))}

      {medics &&
        Object.values(medics).map((medic) => (
          <div>
            <img
              key={medic.id}
              alt="medicLogo"
              className="medicLogo"
              src={medicLogo}
              style={{
                position: "absolute",
                top: medic.coordinates.y * 10,
                left: medic.coordinates.x * 15,
              }}
            />
            <span
              style={{
                position: "absolute",
                top: medic.coordinates.y * 10 - 5,
                left: medic.coordinates.x * 15 - 5,
                color: "green",
              }}
            >
              {medic.id + 1}
            </span>
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
