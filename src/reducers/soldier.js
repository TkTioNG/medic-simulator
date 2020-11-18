
import * as utils from '../utils';
import * as battleActions from '../actions/battle';

export default function battleReducer(state = {}, action) {
    switch (action.type) {
        case battleActions.PREPARE_BATTLEFIELD: {
            const initialLocations = utils.initializeBattlefield();
            return Object.freeze({
                ...state,
                ...initialLocations
                
            })
        }
        // Add other Actions here
        default: {
            return state;
        }
    }
}
