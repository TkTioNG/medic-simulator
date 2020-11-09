import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actions from "./actions";
import soldierStatusEnum from "./enums/soldierStateEnum";
import soldierLogo from "./images/soldier.png";
import injuredSoldierLogo from "./images/injuredSoldier1.jpg";
import "./App.css";

const App = (props) => {
  const { soldiers, prepareBattlefield, startBattle } = props;

  useEffect(() => {
    prepareBattlefield();
  }, [prepareBattlefield]);

  const handleClick = (e) => {
    startBattle();
  };

  return (
    <div className="App">
      <button onClick={handleClick}> Start Battle!</button>
      {soldiers &&
        Object.values(soldiers).map((soldier) => (
          <img
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
    </div>
  );
};

function mapStateToProps(state) {
  return {
    soldiers: state.soldiers,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      prepareBattlefield: actions.prepareBattlefield,
      startBattle: actions.startBattle,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
