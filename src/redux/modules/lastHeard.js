import {createReducer} from 'redux-immutablejs';
import Immutable from 'immutable';
import {createSelector} from 'reselect';

export const UPDATE_TIME = 'audience/lastHeard/UPDATE_TIME';
//import {UPDATE_CURRENT_TIME, episodeId$} from './player';

const initialState = Immutable.fromJS({
});

export default createReducer(initialState, {

    [UPDATE_TIME]: (state, action) => {
        console.info('updating last heard time!', action.time, action.episodeId);
        return state.setIn([action.episodeId], action.time);
    }

})


// Selectors
export const getLastHeardTime = (state, episodeId) => state.getIn(['lastHeard', episodeId], 0);

// Actions
export const updateLastHeardTime = (episodeId, time) => ({
    type: UPDATE_TIME,
    episodeId,
    time
});