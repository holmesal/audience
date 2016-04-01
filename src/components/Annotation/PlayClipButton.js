import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Relay from 'react-relay';

import DebugView from '../common/DebugView';
import colors from '../../colors';
import Icon from 'react-native-vector-icons/Ionicons'

class PlayClipButton extends Component {

    render() {
        return (
            <TouchableOpacity style={styles.wrapper}>
                <Icon name="play"
                      color={colors.white}
                      size={24}/>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Relay.createContainer(PlayClipButton, {
    fragments: {
        clip: () => Relay.QL`
            fragment on Clip {
                id
            }
        `
    }
});