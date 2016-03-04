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
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../colors';

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
            <Icon.Button
                name="log-out"
                style={styles.wrapper}
                onPress={this.logout}
                backgroundColor={'transparent'}
            >
                <Text style={{color:"#fefefe"}}>Logout</Text>
            </Icon.Button>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        width: 200,
        //alignSelf: 'stretch',
        ////height: 60,
        //alignItems: 'center',
        //justifyContent: 'center'
        borderColor: colors.grey,
        borderWidth: 1
    }
});