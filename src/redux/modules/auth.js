import {createReducer} from 'redux-immutablejs';
import {createSelector} from 'reselect';
import Immutable from 'immutable';
import _ from 'lodash';
import {FBSDKAccessToken} from 'react-native-fbsdkcore';
import {FBSDKLoginManager} from 'react-native-fbsdklogin';
import Relay from 'react-relay';
import {updateRelayAuthHeader} from '../../utils/relay';
import {updatePlayerId} from '../../lib/remoteNotifications';
import {requiredReadPermissions} from '../../utils/facebook';

/**
 Action constants
*/
const UPDATE_LOGGED_IN = 'audience/auth/UPDATE_LOGGED_IN';
const UPDATE_CHECKED_LOGIN = 'audience/auth/UPDATE_CHECKED_LOGIN';
const UPDATE_VIEWER_ID = 'audience/auth/UPDATE_VIEWER_ID';

const initialState = Immutable.fromJS({
    checkedLogin: false,
    //token: null,
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
            if (credentials) {
                // Check that this token has all the required permissions
                let hasAllRequiredPermissions = true;
                requiredReadPermissions.forEach(permission => {
                    let hasPermission = credentials.hasGrantedPermission(permission);
                    if (!hasPermission) {
                        console.info('missing required permission: ', permission);
                        hasAllRequiredPermissions = false;
                    }
                });

                // If this does not have all required permissions, logout (will remain on the login screen)
                if (!hasAllRequiredPermissions) {
                    console.info('logging in!');
                    FBSDKLoginManager.logOut();

                // Otherwise, we're all logged in!
                } else {
                    console.info('user is logged in!', credentials);
                    // A non-null token indicates that the user is currently logged in.
                    dispatch(updateLoggedIn(true));
                    // Update the auth token relay sends with requests
                    updateRelayAuthHeader(credentials.tokenString);
                    // Now that we're logged in, send our onesignal playerId to the backend
                    updatePlayerId();
                }
            } else {
                console.info('no credentials found');
                dispatch(updateLoggedIn(false));
            }
            dispatch(updateCheckedLogin(true));
        });
    }
};

export const logout = () => {
    return (dispatch, getState) => {
        dispatch(updateViewerId(null));
        dispatch(updateLoggedIn(false));
    }
}
