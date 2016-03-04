import {createReducer} from 'redux-immutablejs';
import Immutable from 'immutable';
import {createSelector} from 'reselect';

const UPDATE_CURRENT_TAB = 'audience/tabs/UPDATE_CURRENT_TAB';

const initialState = Immutable.fromJS({
    currentTab: 'discover'
});

export default createReducer(initialState, {

    [UPDATE_CURRENT_TAB]: (state, action) => state.set('currentTab', action.currentTab)

})

// Selectors
export const currentTab$ = state => state.getIn(['tabs', 'currentTab']);
export const tabs$ = createSelector(currentTab$, (currentTab) => ({
    currentTab
}));

// Actions
export const updateCurrentTab = currentTab => ({
    type: UPDATE_CURRENT_TAB,
    currentTab
});