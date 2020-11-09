import { combineReducers } from 'redux';

import soldierReducer from './soldier';

const rootReducer = combineReducers({
    soldiers: soldierReducer,
    // Other reducers if needed
})

export default rootReducer;
