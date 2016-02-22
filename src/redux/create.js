// This module bootstraps and exports the flux store
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import devTools from 'remote-redux-devtools';

// Import the root reducer (which imports all subreducers)
import rootReducer from './modules/index';

let store;

// Initializing with middleware
const createStoreWithMiddleware = applyMiddleware(
    // we're using redux-thunk for async actions
    thunk
    // Create a logger to make it easy to debug state changes
    //createLogger({
    //    collapsed: true
    //})
);

let finalCreateStore;
if (__DEV__) {
    finalCreateStore = compose(
        createStoreWithMiddleware,
        devTools({
            //hostname: 'localhost',
            //port: 8000,
            name: 'Audience iOS'
        })
    )(createStore);
} else {
    finalCreateStore = compose(
        createStoreWithMiddleware
    )(createStore);
}

store = finalCreateStore(rootReducer);

export default store;
