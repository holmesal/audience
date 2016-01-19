/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    StatusBarIOS,
    Text,
    View
} from 'react-native';

import {FBSDKAccessToken} from 'react-native-fbsdkcore'
import Parse from 'parse/react-native';

import colors from './src/colors';
import Scrubber from './src/components/Scrubber';
import Search from './src/components/Search/Search';
import Login from './src/components/Login';

Parse.initialize(
    'WTgPZNQN94mjVaaI6OUBiD2ujHOoQYqg2b8Lex20',
    'I5FMaW4LfQlVTLwzRVqAWR4LFBOQy5mMILp5MOgH'
);

class HorizontalScrollTest extends Component {

    state = {
        player: false,
        checkedLogin: false,
        loggedIn: false
    };

    fetchAccessToken() {
        FBSDKAccessToken.getCurrentAccessToken((credentials) => {
            let loggedIn = false;
            if (credentials) {
                console.info('user is logged in!', credentials);
                // A non-null token indicates that the user is currently logged in.
                loggedIn = true;
                // Log in with parse
                this.parseLogin(credentials);
            } else {
                console.info('no credentials found')
                this.setState({loggedIn: false, checkedLogin: true});
            }
        });
    }

    parseLogin(credentials) {
        // the timestamp needs to be reformatted for Parse http://stackoverflow.com/questions/12945003/format-date-as-yyyy-mm-ddthhmmss-sssz
        var expdate = new Date(credentials._expirationDate);
        expdate = expdate.toISOString();

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
                    console.info("User signed up and logged in through Facebook!");
                } else {
                    console.info("User logged in through Facebook!");
                }
                console.info(user);
                this.setState({loggedIn: true, checkedLogin: true});
            },
            error: (user, error) => {
                console.log(user,error);
                console.warn("User cancelled the Facebook login or did not fully authorize.");
                this.setState({loggedIn: false, checkedLogin: true});
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

    render() {
        if (!this.state.checkedLogin) return <View />;
        if (!this.state.loggedIn) return <Login onLogin={this.fetchAccessToken.bind(this)} />;
        return (
            <View style={style.wrapper}>
                {!this.state.player && <Search showPlayer={() => this.setState({player: true})}/>}
                {this.state.player && <Scrubber hidePlayer={() => this.setState({player: false})}/>}
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

AppRegistry.registerComponent('HorizontalScrollTest', () => HorizontalScrollTest);
