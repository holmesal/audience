import {createReducer} from 'redux-immutablejs';
import Immutable from 'immutable';
//import request from 'superagent';

const UPDATE_QUERY = 'audience/search/UPDATE_QUERY';
//const UPDATE_IN_FLIGHT = 'audience/search/UPDATE_IN_FLIGHT';
//const UPDATE_RESULTS = 'audience/search/UPDATE_RESULTS';

const initialState = Immutable.fromJS({
    //results: [],
    query: '99',
    //inFlight: false
});

export default createReducer(initialState, {

    [UPDATE_QUERY]: (state, action) => state.set('query', action.query),

    //[UPDATE_IN_FLIGHT]: (state, action) => state.set('inFlight', action.inFlight),
    //
    //[UPDATE_RESULTS]: (state, action) => state.set('results', action.results),

})

// Selectors
//export const results$ = state => state.getIn(['search', 'results']);
export const query$ = state => state.getIn(['search', 'query']);

// Actions
export const updateQuery = query => ({
    type: UPDATE_QUERY,
    query: query
})

//let inFlight;
//export function search(query) {
//    return (dispatch, getState) =
//        // Update inFlight
//        dispatch(updateInFlight(true));
//        // Abort any existing requests
//        if (inFlight) inFlight.abort();
//        inFlight = request
//            .get('https://itunes.apple.com/search')
//            .accept('application/json')
//            .query({
//                limit: 5,
//                term: query,
//                media: 'podcast'
//            })
//            .end((err, res) => {
//                if (err) console.error(err);
//                let body = JSON.parse(res.text);
//                //console.info('podcast search results', body.results);
//
//                let results = body.results.map((res) => ({
//                    type: 'podcast',
//                    podcastId: res.collectionId.toString(),
//                    primary: res.collectionName,
//                    secondary: 'Podcast',
//                    photoUrl: res.artworkUrl100
//                }));
//
//                // Request is no longer in-flight
//                inFlight = null;
//                dispatch(updateInFlight(false));
//                // Update results
//                dispatch(updateResults(results));
//            });
//    }
//}
//
//export const updateInFlight = (inFlight) => ({
//    type: UPDATE_IN_FLIGHT,
//    inFlight
//});
//
//const updateResults = (results) => ({
//    type: UPDATE_RESULTS,
//    results
//});