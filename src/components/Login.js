import React, {
    Component,
    Image,
    Text,
    View
} from 'react-native';

import FBSDKLogin, {FBSDKLoginButton, FBSDKLoginManager} from 'react-native-fbsdklogin';
import {FBSDKGraphRequest} from 'react-native-fbsdkcore';

export default class Login extends Component {


    fetchInfo() {
        console.info('fetching user info...')
        // Create a graph request asking for friends with a callback to handle the response.
        var fetchFriendsRequest = new FBSDKGraphRequest((error, result) => {
            if (error) {
                alert('Error making request.');
            } else {
                // Data from request is in result
                console.info(result);
            }
        }, '/me?fields=email');
        // Start the graph request.
        fetchFriendsRequest.start();
    }

    componentDidMount() {
        //setTimeout(this.login.bind(this), 1000)
        //this.login()
    }


    render() {
        return (
            <View style={style.wrapper}>
                <FBSDKLoginButton
                    onLoginFinished={(error, result) => {
                        if (error) {
                          console.error(error);
                        } else {
                          if (result.isCancelled) {
                            console.info('Login cancelled.');
                          } else {
                            console.info(result);
                            console.info('Logged in.');
                            this.fetchInfo();
                            this.props.onLogin();
                          }
                        }
                      }}
                    onLogoutFinished={() => alert('Logged out.')}
                    onWillLogin={() => console.info('will login')}
                    readPermissions={[]}
                    publishPermissions={[]}/>
            </View>
        );
    }
}

let style = {
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
};