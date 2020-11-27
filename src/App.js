import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Badge from "@material-ui/core/Badge";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import ReplayIcon from "@material-ui/icons/Replay";
import Face from "@material-ui/icons/Face";
import Chat from "@material-ui/icons/Chat";
import Build from "@material-ui/icons/Build";

import CustomTabs from "./components/CustomTabs";

import * as actions from "./actions";
import soldierStatusEnum from "./enums/soldierStateEnum";
import soldierLogo from "./images/soldier.png";
import injuredSoldierLogo from "./images/injuredSoldier1.jpg";
import medicLogo from "./images/medic.png";
import healingLogo from "./images/healing.png";
import * as settings from "./settings";
import "./App.css";

const styles = {
  textCenter: {
    textAlign: "center",
  },
};

const useStyles = makeStyles(styles);

const App = (props) => {
  const {
    soldiers,
    medics,
    prepareBattlefield,
    startBattle,
    stopBattle,
    resumeBattle,
    cycleCount,
    successCount,
    isCycleStop,
  } = props;

  const classes = useStyles();

  const [isBattleStart, setIsBattleStart] = useState(false);

  useEffect(() => {
    prepareBattlefield();
  }, [prepareBattlefield]);

  const handleStartBattle = () => {
    setIsBattleStart(true);
    startBattle();
  };

  const handleStopBattle = () => {
    stopBattle();
  };

  const handleResumeBattle = () => {
    resumeBattle();
  };

  const handleRestartBattle = () => {
    prepareBattlefield();
    setIsBattleStart(false);
  };

  return (
    <div className="App">
      <div
        className="finishing-line"
        style={{
          left: settings.GRID_LENGTH * 15,
          height: settings.GIRD_HEIGHT * 10 + 100,
        }}
      ></div>

      <CustomTabs
        headerColor="success"
        tabs={[
          {
            tabName: "Success Count: " + successCount,
          },
          {
            tabName: "Cycle Count: " + cycleCount,
          },
        ]}
      />

      {successCount >= 10 ? (
        <div>
          <h1 style={{ color: "limegreen" }}>
            Hooray! All the soldier has crossed the battlefield.
          </h1>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ReplayIcon />}
            onClick={handleRestartBattle}
          >
            Restart
          </Button>
        </div>
      ) : !isBattleStart ? (
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon />}
          onClick={handleStartBattle}
        >
          Start Battle!
        </Button>
      ) : !isCycleStop ? (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PauseIcon />}
          onClick={handleStopBattle}
        >
          Stop Battle!
        </Button>
      ) : (
        <div>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={handleResumeBattle}
          >
            Resume
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ReplayIcon />}
            onClick={handleRestartBattle}
          >
            Restart
          </Button>
        </div>
      )}
      <div>
        {soldiers &&
          Object.values(soldiers).map((soldier) => (
            <div
              key={soldier.id}
              className="Logo-holder"
              style={{
                top: soldier.coordinates.y * 10 + 90,
                left: soldier.coordinates.x * 15,
                color: "red",
              }}
            >
              <Badge
                badgeContent={soldier.id + 1}
                color={
                  soldier.status === soldierStatusEnum.HEALTHY
                    ? "default"
                    : "error"
                }
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
              </Badge>
            </div>
          ))}

        {medics &&
          Object.values(medics).map((medic) => (
            <div
              key={medic.id}
              className="Logo-holder"
              style={{
                top: medic.coordinates.y * 10 + 90,
                left: medic.coordinates.x * 15,
                color: "green",
              }}
            >
              <Badge badgeContent={medic.id + 1} color="default">
                <img alt="medicLogo" className="medicLogo" src={medicLogo} />
              </Badge>
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
    </div>
  );
};

function mapStateToProps(state) {
  return {
    medics: state.medics.medics,
    soldiers: state.soldiers.soldiers,
    cycleCount: state.soldiers.cycle_count,
    successCount: state.soldiers.success_count,
    isCycleStop: state.battle.isCycleStop,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      prepareBattlefield: actions.prepareBattlefield,
      startBattle: actions.startBattle,
      stopBattle: actions.stopBattle,
      resumeBattle: actions.resumeBattle,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
