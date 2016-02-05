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
    StatusBarIOS,
    Text,
    View
} from 'react-native';

import './redux/create';

import {FBSDKAccessToken} from 'react-native-fbsdkcore'
import Parse from 'parse/react-native';
import Mixpanel from 'react-native-mixpanel';

import colors from './colors';
import Player from './components/Player/Player';
import Search from './components/Search/Search';
import PodcastInfo from './components/PodcastInfo/PodcastInfo';
import Login from './components/Login';

// initialize parse
Parse.initialize(
    'WTgPZNQN94mjVaaI6OUBiD2ujHOoQYqg2b8Lex20',
    'I5FMaW4LfQlVTLwzRVqAWR4LFBOQy5mMILp5MOgH'
);

// Initialize mixpanel
if (__DEV__) {
    Mixpanel.sharedInstanceWithToken('255425e8c5444a985a94d0a14500e7ef');
} else {
    Mixpanel.sharedInstanceWithToken('e427bf5ada34e28eced40b58b6c468f9');
}

export default class App extends Component {

    state = {
        player: false,
        checkedLogin: false,
        loggedIn: false
    };

    fetchAccessToken() {
        FBSDKAccessToken.getCurrentAccessToken((credentials) => {
            let loggedIn = false;
            if (credentials) {
                //console.info('user is logged in!', credentials);
                // A non-null token indicates that the user is currently logged in.
                loggedIn = true;
                // Log in with parse
                this.parseLogin(credentials);
            } else {
                console.info('no credentials found');
                this.setState({loggedIn: false, checkedLogin: true});
            }
        });
    }

    parseLogin(credentials) {
        // the timestamp needs to be reformatted for Parse http://stackoverflow.com/questions/12945003/format-date-as-yyyy-mm-ddthhmmss-sssz
        var expdate = new Date(credentials._expirationDate);
        expdate = expdate.toISOString();

        Mixpanel.identify(credentials.userID);

        // these are the data from the successful FB login we will pass to Parse.FacebookUtils.logIn instead of null
        // based on https://github.com/ParsePlatform/ParseReact/issues/45#issuecomment-111063927
        let authData = {
            id: credentials.userID,
            access_token: credentials.tokenString,
            expiration_date: expdate
        };

        Parse.FacebookUtils.logIn(authData, {
            success: (user) => {
                if (!user.existed()) {
                    //console.info("User signed up and logged in through Facebook!");
                } else {
                    //console.info("User logged in through Facebook!");
                }
                //console.info(user);
                this.setState({loggedIn: true, checkedLogin: true});
            },
            error: (user, error) => {
                switch (error.code) {
                    case Parse.Error.INVALID_SESSION_TOKEN:
                        Parse.User.logOut().then(() => {
                            this.parseLogin(credentials);
                        });
                        break;
                    default:
                        this.setState({loggedIn: false, checkedLogin: true});
                        console.warn("Error logging in with parse");
                        console.error(error);
                }
            }
        });
    }

    componentWillMount() {
        this.fetchAccessToken();
    }

    componentDidMount() {
        StatusBarIOS.setStyle('light-content');
        // Attempt to get an access token
    }

    renderLoading() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicatorIOS />
            </View>
        )
    }

    render() {
        if (!this.state.checkedLogin) return this.renderLoading();
        if (!this.state.loggedIn) return <Login onLogin={this.fetchAccessToken.bind(this)} />;
        return (
            <View style={style.wrapper}>
                <Search showPlayer={() => this.setState({player: true})}/>
                <PodcastInfo />
                <Player />
            </View>
        );
    }
}

const style = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.darkGrey
    }
});
