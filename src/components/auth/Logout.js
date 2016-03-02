import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import store from '../../redux/create';
import {logout} from '../../redux/modules/auth';

import FBSDKLogin, {FBSDKLoginButton, FBSDKLoginManager} from 'react-native-fbsdklogin';

export default class Logout extends Component {

    static propTypes = {};

    static defaultProps = {};

    logout() {
        FBSDKLoginManager.logOut();
        store.dispatch(logout());
    }

    render() {
        return (
            <TouchableOpacity style={styles.wrapper} onPress={this.logout}>
                <Text style={{color:"#fefefe"}}>Logout</Text>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    }
});