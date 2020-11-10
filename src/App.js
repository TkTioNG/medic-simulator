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
        style={{
          position: "absolute",
          top: 0,
          left: settings.GRID_LENGTH * 15,
          height: settings.GIRD_HEIGHT * 10,
          width: "5px",
          backgroundColor: "black",
        }}
      ></div>
      <button onClick={handleClick}> Start Battle!</button>
      {soldiers &&
        Object.values(soldiers).map((soldier) => (
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
        ))}

      {medics &&
        Object.values(medics).map((medic) => (
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
        ))}
    </div>
  );
};

function mapStateToProps(state) {
  // console.log(state)
  return {
    medics: state.soldiers.medics,
    soldiers: state.soldiers.soldiers,
    cycle_count: state.soldiers.cycle_count,
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
