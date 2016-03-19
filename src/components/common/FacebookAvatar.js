import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import colors from '../../colors';
import {getTintForUser, tintOpacity} from '../../utils/tints';

class FacebookAvatar extends Component {

    static propTypes = {
        size: PropTypes.number,
        tint: PropTypes.bool
    };

    static defaultProps = {
        size: 50,
        tint: false
    };

    renderMask() {
        if (this.props.tint) {
            return (
                <View style={[styles.tint, {backgroundColor: getTintForUser(this.props.user.id)}]} />
            )
        }
    }

    render() {
        const photoUrl = `http://graph.facebook.com/v2.5/${this.props.user.facebookId}/picture?type=square&height=${this.props.size * 2}`;
        return (
            <Image
                style={[styles.photo, {width: this.props.size, height: this.props.size, borderRadius: this.props.size/2}, this.props.style]}
                source={{uri: photoUrl}}
            >
                    {this.renderMask()}
            </Image>
        )
    }
}

let styles = StyleSheet.create({
    photo: {
        backgroundColor: colors.lighterGrey,
        position: 'relative'
    },
    tint: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        opacity: tintOpacity
    }
});

export default Relay.createContainer(FacebookAvatar, {
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                id
                facebookId
            }
        `
    }
});