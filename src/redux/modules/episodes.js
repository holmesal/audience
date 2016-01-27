import {createReducer} from 'redux-immutablejs';
import Immutable from 'immutable';
import request from 'superagent';
//import feedparser from 'feedparser';
//import htmlparser from '../../lib/htmlparser2';

const UPDATE_EPISODES = 'audience/podcasts/UPDATE_EPISODES';

const initialState = Immutable.fromJS({
});

export default createReducer(initialState, {

    [UPDATE_EPISODES]: (state, action) => state.get(action.podcastId).merge(action.episodes)

})

// Selectors
export const episodes$ = state => state.getIn(['episodes']);

// Actions
export const updateEpisodes = (podcastId, episodes) => ({
    type: UPDATE_EPISODES,
    podcastId,
    episodes
});

export const fetchEpisodes = (podcastId) => {
    return (dispatch, getState) => {
        //let existing = getState().getIn(['episodes', podcastId, episodeId]);
        //console.info('existing podcast: ', existing);
        let feedUrl = getState().getIn(['podcasts', podcastId, 'feedUrl']);
        console.info('fetching latest episodes for ', podcastId, feedUrl);

        if (!feedUrl) {
            console.error(`no feed url found for podcast ${podcastId}`);
            return false;
        }
        // get the feed url for this podcast
        request
            .get(`https://ajax.googleapis.com/ajax/services/feed/load`)
            .accept('json')
            .query({
                v: '1.0',
                num: 10,
                output: 'json_xml',
                q: feedUrl
            })
            .end((err, res) => {
                if (err) console.error(err);
                let body = JSON.parse(res.text);
                console.info(body);
                console.info(body.responseData.feed.entries[0].mediaGroups);

                //console.info(htmlparser);
                //
                //let parser = new htmlparser.Parser((err, dom) => {
                //    console.info(err, dom);
                //});
                //parser.parseComplete(body.responseData.xmlString);

                ////console.info('podcast results for id ', podcastId, body);
                //let podcast = body.results[0];
                //if (podcast) {
                //    dispatch(updatePodcast(podcastId, podcast))
                //} else {
                //    console.error(`No iTunes podcast exists for id ${podcastId}`);
                //}
            });


        //if (!existing) {
        //}
    }
}