// This module bootstraps and exports the flux store
import {createStore, applyMiddleware, compose} from 'redux';
import {NativeModules} from 'react-native';
let {MTDebugIP} = NativeModules;
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import devTools from 'remote-redux-devtools';
import {AsyncStorage} from 'react-native'

import * as storage from 'redux-storage';
import immutableMerger from 'redux-storage-merger-immutablejs';
import immutablejs from 'redux-storage-decorator-immutablejs';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import filter from 'redux-storage-decorator-filter'
import {UPDATE_TIME} from '../redux/modules/lastHeard';

// Import the root reducer (which imports all subreducers)
import rootReducer from './modules/index';


// Create a storage engine under the key for this app
let engine = createEngine('chorus');
// Use the immutablejs engine
engine = immutablejs(engine);
// Only persist part of the state tree
engine = filter(engine, [
    'lastHeard'
], [
]);

// Only save for specific actions
const storageMiddlware = storage.createMiddleware(engine, [], [UPDATE_TIME]);

// Initializing with middleware
const createStoreWithMiddleware = applyMiddleware(
    // we're using redux-thunk for async actions
    thunk,
    storageMiddlware
    //a logger to make it easy to debug state changes
    //createLogger({
    //    collapsed: true
    //})
);

let finalCreateStore;
if (__DEV__) {
    finalCreateStore = compose(
        //autoRehydrate(),
        createStoreWithMiddleware,
        devTools()
        //devTools({
        //    hostname: 'http://172.20.10.4',
        //    port: 8000,
        //    name: 'Audience iOS'
        //})
    )(createStore);
} else {
    finalCreateStore = compose(
        //autoRehydrate(),
        createStoreWithMiddleware
    )(createStore);
}

// Create the storage reducer with an immutable merger
const storageReducer = storage.reducer(rootReducer, immutableMerger);

// Actually create the store
const store = finalCreateStore(storageReducer);

// Load from previous state
const load = storage.createLoader(engine);
load(store)
    .then((newState) => console.log('Loaded state:', newState))
    .catch(() => console.log('Failed to load previous state'));

export default store;
