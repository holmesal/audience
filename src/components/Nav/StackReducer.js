import {
    NavigationExperimental
} from 'react-native';

const {
    StateUtils: NavigationStateUtils
} = NavigationExperimental;

const defaultGetReducerForState = (initialState) => (state) => state || initialState;

function NavigationStackReducer({initialState, getReducerForState, getPushedReducerForAction, customBackActions}) {
    console.info('custom stack reducer created wtih ', customBackActions, arguments)
    const getReducerForStateWithDefault = getReducerForState || defaultGetReducerForState;
    return function (lastState, action) {
        console.info('navigation stack reducer is running', lastState, action, customBackActions)

        // If there is no state, use the initial state
        if (!lastState) {
            return initialState;
        }
        // Get the parent of the
        const lastParentState = NavigationStateUtils.getParent(lastState);
        console.info('last parent state: ', lastParentState)
        if (!lastParentState) {
            return lastState;
        }
        console.info('got this far!');
        if (customBackActions.indexOf(action.type) != -1) {
            console.info(`[StackReducer] - `, action.type + ' was found in custom back actions - treating as back');
            if (lastParentState.index === 0 || lastParentState.children.length === 1) {
                return lastParentState;
            }
            return NavigationStateUtils.pop(lastParentState);
        }
        switch (action.type) {
            case 'back':
            case 'BackAction':
                if (lastParentState.index === 0 || lastParentState.children.length === 1) {
                    return lastParentState;
                }
                return NavigationStateUtils.pop(lastParentState);
        }

        const activeSubState = lastParentState.children[lastParentState.index];
        const activeSubReducer = getReducerForStateWithDefault(activeSubState);
        const nextActiveState = activeSubReducer(activeSubState, action);
        if (nextActiveState !== activeSubState) {
            const nextChildren = [...lastParentState.children];
            nextChildren[lastParentState.index] = nextActiveState;
            return {
                ...lastParentState,
                children: nextChildren,
            };
        }

        const subReducerToPush = getPushedReducerForAction(action, lastParentState);
        if (subReducerToPush) {
            return NavigationStateUtils.push(
                lastParentState,
                subReducerToPush(null, action)
            );
        }
        return lastParentState;
    };
}

module.exports = NavigationStackReducer;

export default NavigationStackReducer;
