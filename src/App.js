import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Modal from 'react-bootstrap-modal';

import * as battleActions from './actions/battle';
import soldierStatusEnum from './enums/soldierStateEnum'
import soldierLogo from './soldier.png';
import injuredSoldierLogo from './injuredSoldier1.jpg'
import './App.css';


const App = (props) => {
  const { soldiers, prepareBattlefield, startBattle } = props;

  const [isModalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    prepareBattlefield();
  }, [])
  
  const handleClick = (e) => {
    setModalOpen(false)
    startBattle()
  }
  return (
    <div className="App">
      <Modal show={isModalOpen}>
        <button onClick={handleClick}> Start Battle!</button>
      </Modal>  
      {soldiers && Object.values(soldiers).map(soldier => 
          <img alt="soldierLogo" className="soldierLogo" src={soldier.status === soldierStatusEnum.HEALTHY ? soldierLogo : injuredSoldierLogo}
          style={{ position: 'absolute', top: soldier.coordinates.y*10, left: soldier.coordinates.x*15 }}/>
        )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    soldiers: state.soldiers,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    prepareBattlefield: battleActions.prepareBattlefield,
    startBattle: battleActions.startBattle,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
