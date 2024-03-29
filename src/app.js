/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
    ActivityIndicatorIOS,
    AppRegistry,
    Component,
    StyleSheet,
    StatusBar,
    Text,
    View
} from 'react-native';

import './notifications';

import './lib/linking';

import './redux/create';

import './utils/relay';

import {FBSDKAccessToken} from 'react-native-fbsdkcore'
import Parse from 'parse/react-native';
import Mixpanel from 'react-native-mixpanel';

import colors from './colors';
import Auth from './components/auth/Auth';

// Ignore some warnings
console.ignoredYellowBox = ['Possible Unhandled Promise Rejection', 'Sticky header index 0'];

// Initialize mixpanel
if (__DEV__) {
    Mixpanel.sharedInstanceWithToken('255425e8c5444a985a94d0a14500e7ef');
} else {
    Mixpanel.sharedInstanceWithToken('e427bf5ada34e28eced40b58b6c468f9');
}

export default class App extends Component {

    componentDidMount() {
        StatusBar.setBarStyle('light-content');
    }

    render() {
        return <Auth />;
    }
}

const style = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.darkGrey
    }
});
