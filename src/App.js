import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Modal from "react-bootstrap-modal";

import * as battleActions from "./actions/battle";
import soldierStatusEnum from "./enums/soldierStateEnum";
import "./App.css";

import * as actions from "./actions";
import soldierLogo from "./images/soldier.png";
import injuredSoldierLogo from "./images/injuredSoldier1.jpg";
import medicLogo from "./images/medic.png";
import healingLogo from "./images/healing.png";
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

  const [isModalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    prepareBattlefield();
  }, [prepareBattlefield]);

  const handleClick = (e) => {
    setModalOpen(false);
    startBattle();
  };
  return (
    <div className="App">
      <Modal show={isModalOpen}>
        <button onClick={handleClick}> Start Battle!</button>
      </Modal>
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
    medics: state.medics.medics,
    soldiers: state.soldiers.soldiers,
    cycle_count: state.soldiers.cycle_count,
    success_count: state.soldiers.success_count,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      prepareBattlefield: battleActions.prepareBattlefield,
      startBattle: battleActions.startBattle,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
