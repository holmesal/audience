import {createReducer} from 'redux-immutablejs';
import {createSelector} from 'reselect';
import Immutable from 'immutable';
import request from 'superagent';
import log from '../../utils/log';
import moment from 'moment';
import _ from 'lodash';

const UPDATE_PLAYING_EPISODE = 'audience/player/UPDATE_PLAYING_EPISODE';

const initialState = Immutable.fromJS({
    episodeId: null
});

export default createReducer(initialState, {

    [UPDATE_PLAYING_EPISODE]: (state, action) => state.set('episodeId', action.episodeId)

})

// Selectors

// Actions
export const updatePlayingEpisode = (episodeId) => ({
    type: UPDATE_PLAYING_EPISODE,
    episodeId
});
export const playEpisode = (podcastId, episodeId) => {
    return (dispatch, getState) => {
        console.info(podcastId, episodeId);
        let audio = getState().getIn(['episodes', podcastId]).find((ep) => ep.get('uid') === episodeId, null, Immutable.Map()).get('audio').toJS();
        console.info(audio);
        //let mp3Url =
        dispatch(updatePlayingEpisode(episodeId));
    }
};