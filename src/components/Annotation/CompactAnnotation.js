import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import PlayClipButton from './PlayClipButton';
import DebugView from '../common/DebugView';
import colors from '../../colors';
import FacebookAvatar from '../common/FacebookAvatar';

class CompactAnnotation extends Component {

    render() {
        return (
            <View style={styles.wrapper}>

                <FacebookAvatar user={this.props.annotation.user} />

                <View style={styles.textWrapper}>
                    <Text style={[styles.text, styles.name]}>{this.props.annotation.user.displayName}</Text>
                    <Text style={[styles.text, styles.body]}>{this.props.annotation.text}</Text>
                </View>

                <PlayClipButton
                    clip={this.props.annotation.clip}
                />


            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        backgroundColor: colors.darkGreyLightContrast,
        paddingLeft: 12,
        alignItems: 'center'
    },

    textWrapper: {
        padding: 20,
        flex: 1
    },
    text: {
        fontFamily: 'System',
        color: colors.lightGrey
    },
    name: {
        fontWeight: '500'
    }
});

export default Relay.createContainer(CompactAnnotation, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                text
                user {
                    displayName
                    ${FacebookAvatar.getFragment('user')}
                }
                clip {
                    ${PlayClipButton.getFragment('clip')}
                }
            }
        `
    }
})