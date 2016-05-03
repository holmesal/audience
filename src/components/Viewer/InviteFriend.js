import React, {
    ActionSheetIOS,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import colors from '../../colors';

import {PrimaryText} from '../../type';
import Icon from 'react-native-vector-icons/Ionicons';

export default class InviteFriend extends Component {

    invite() {
        ActionSheetIOS.showShareActionSheetWithOptions({
            url: 'http://pfoo.herokuapp.com',
            message: '🚀🙌🎧 Join the Chorus beta!',

        },
        error => console.error,
        (success, method) => {
            if (success) {
                console.info('shared via: ', method);
            } else {
                console.info('user did not share')
            }
        })
    }

    render() {
        return (
            <View style={{marginTop: 40, marginBottom: 40}}>
                <Icon.Button
                    style={styles.wrapper}
                    name="android-contacts"
                    onPress={this.invite.bind(this)}
                    backgroundColor={colors.attention}
                >
                    <Text style={styles.text}>Invite a friend</Text>
                </Icon.Button>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        width: 200
    },
    text: {
        color: '#fefefe',
        fontFamily: 'System',
        fontWeight: '400'
    }
});