import React, {
    Component,
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import FBSDKLogin, {FBSDKLoginButton, FBSDKLoginManager} from 'react-native-fbsdklogin';

export default class Logout extends Component {

    static propTypes = {};

    static defaultProps = {};

    logout() {
        FBSDKLoginManager.logOut();
    }

    render() {
        return (
            <TouchableOpacity style={style.wrapper} onPress={this.logout}>
                <Text style={{color:"#fefefe"}}>Logout</Text>
            </TouchableOpacity>
        );
    }
}

let style = {
    wrapper: {
        alignSelf: 'stretch',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    }
};