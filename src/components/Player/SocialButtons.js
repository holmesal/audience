import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    VibrationIOS,
    View
} from 'react-native';

import {FBSDKAppEvents} from 'react-native-fbsdkcore'
import Mixpanel from 'react-native-mixpanel';
import {connect} from 'react-redux/native';
import {share$, currentTime$} from '../../redux/modules/player.js';
import store from '../../redux/create.js';

class SocialButtons extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        composeVisible: false,
        comment: null
    };

    reaction() {
        let {podcastId, episodeId} = this.props;
        let episodeTime = Math.round(currentTime$(store.getState()));
        Mixpanel.trackWithProperties('Leave Reaction', {
            podcastId,
            episodeId,
            episodeTime
        });
        VibrationIOS.vibrate();
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity style={styles.buttonWrapper} onPress={this.reaction.bind(this)}>
                    <View style={styles.button}>
                        <Text style={{fontSize: 30}}>😁</Text>
                    </View>
                    <Text style={styles.caption}>LEAVE</Text>
                    <Text style={styles.caption}>REACTION</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonWrapper} onPress={() => this.props.showCompose()}>
                    <View style={styles.button}>
                        <Text style={{fontSize: 30}}>💬</Text>
                    </View>
                    <Text style={styles.caption}>LEAVE</Text>
                    <Text style={styles.caption}>COMMENT</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 56,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'transparent'
    },
    buttonWrapper: {
        alignItems: 'center'
    },
    button: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.28)',
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    caption: {
        fontFamily: 'System',
        fontSize: 12,
        color: '#7C7C7C',
        fontWeight: '200'
    }
});

export default connect(share$)(SocialButtons);