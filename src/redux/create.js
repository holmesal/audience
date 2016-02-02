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
    thunk,
    // Create a logger to make it easy to debug state changes
    createLogger({
        collapsed: true
    })
);

const finalCreateStore = compose(
    createStoreWithMiddleware,
    devTools({
        //hostname: 'localhost',
        //port: 8000,
        //name: 'Audience iOS'
    })
)(createStore);

// Create the store with an initial (empty) state
// In a complex application, we might rehydrate this state from AsyncStorage or etc

//store = createStoreWithMiddleware(rootReducer, rehydratedState);
store = finalCreateStore(rootReducer);

//store.subscribe(() => {
//    console.log(JSON.stringify(store.getState()));
//});

export default store;
