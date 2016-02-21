import {createReducer} from 'redux-immutablejs';
import {createSelector} from 'reselect';
import Immutable from 'immutable';
import _ from 'lodash';
import {FBSDKAccessToken} from 'react-native-fbsdkcore'

/**
 Action constants
*/
const UPDATE_LOGGED_IN = 'audience/auth/UPDATE_LOGGED_IN';
const UPDATE_CHECKED_LOGIN = 'audience/auth/UPDATE_CHECKED_LOGIN';

const initialState = Immutable.fromJS({
    checkedLogin: false,
    token: null
});

/**
 * Reducer
 */
export default createReducer(initialState, {

    [UPDATE_LOGGED_IN]: (state, action) => state.set('loggedIn', action.loggedIn),

    [UPDATE_CHECKED_LOGIN]: (state, action) => state.set('checkedLogin', action.checkedLogin)

});

/**
 * Selectors
 */
export const loggedIn$ = state => state.getIn(['auth', 'loggedIn']);
export const checkedLogin$ = state => state.getIn(['auth', 'checkedLogin']);
export const auth$ = createSelector(loggedIn$, checkedLogin$, (loggedIn, checkedLogin) => ({
    loggedIn,
    checkedLogin
}));

// Injects the auth token in the relay network layer
let injectAccessToken = (token) => {
    console.info('todo - inject access token into relay network layer');
};

const updateLoggedIn = (loggedIn) => ({
    type: UPDATE_LOGGED_IN,
    loggedIn
});

const updateCheckedLogin = (checkedLogin) => ({
    type: UPDATE_CHECKED_LOGIN,
    checkedLogin
});

export const checkLogin = () => {
    return (dispatch, getState) => {
        FBSDKAccessToken.getCurrentAccessToken((credentials) => {
            dispatch(updateCheckedLogin(true));
            if (credentials) {
                console.info('user is logged in!', credentials);
                // A non-null token indicates that the user is currently logged in.
                dispatch(updateLoggedIn(true));
                // Inject
                injectAccessToken(credentials.tokenString);
            } else {
                console.info('no credentials found');
                dispatch(updateLoggedIn(false));
            }
        });
    }
};

