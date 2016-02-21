import {createReducer} from 'redux-immutablejs';
import {createSelector} from 'reselect';
import Immutable from 'immutable';
import _ from 'lodash';
import {FBSDKAccessToken} from 'react-native-fbsdkcore'
import Relay from 'react-relay';
import {updateRelayAuthHeader} from '../../utils/relay';

/**
 Action constants
*/
const UPDATE_LOGGED_IN = 'audience/auth/UPDATE_LOGGED_IN';
const UPDATE_CHECKED_LOGIN = 'audience/auth/UPDATE_CHECKED_LOGIN';
const UPDATE_VIEWER_ID = 'audience/auth/UPDATE_VIEWER_ID';

const initialState = Immutable.fromJS({
    checkedLogin: false,
    token: null,
    viewerId: null
});

/**
 * Reducer
 */
export default createReducer(initialState, {

    [UPDATE_LOGGED_IN]: (state, action) => state.set('loggedIn', action.loggedIn),

    [UPDATE_CHECKED_LOGIN]: (state, action) => state.set('checkedLogin', action.checkedLogin),

    [UPDATE_VIEWER_ID]: (state, action) => state.set('viewerId', action.viewerId)

});

/**
 * Selectors
 */
export const loggedIn$ = state => state.getIn(['auth', 'loggedIn']);
export const checkedLogin$ = state => state.getIn(['auth', 'checkedLogin']);
export const viewerId$ = state => state.getIn(['auth', 'viewerId']);
export const auth$ = createSelector(loggedIn$, checkedLogin$, (loggedIn, checkedLogin) => ({
    loggedIn,
    checkedLogin
}));

const updateLoggedIn = (loggedIn) => ({
    type: UPDATE_LOGGED_IN,
    loggedIn
});

const updateCheckedLogin = (checkedLogin) => ({
    type: UPDATE_CHECKED_LOGIN,
    checkedLogin
});

export const updateViewerId = (viewerId) => ({
    type: UPDATE_VIEWER_ID,
    viewerId
});

export const checkLogin = () => {
    return (dispatch, getState) => {
        FBSDKAccessToken.getCurrentAccessToken((credentials) => {
            dispatch(updateCheckedLogin(true));
            if (credentials) {
                console.info('user is logged in!', credentials);
                // A non-null token indicates that the user is currently logged in.
                dispatch(updateLoggedIn(true));
                // Update the auth token relay sends with requests
                updateRelayAuthHeader(credentials.tokenString);
            } else {
                console.info('no credentials found');
                dispatch(updateLoggedIn(false));
            }
        });
    }
};

