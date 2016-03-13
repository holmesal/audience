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

class FacebookAvatar extends Component {

    static propTypes = {
        size: PropTypes.number
    };

    static defaultProps = {
        size: 50
    };

    render() {
        const photoUrl = `http://graph.facebook.com/v2.5/${this.props.user.facebookId}/picture?type=square&height=${this.props.size * 2}`;
        return <Image
            style={[styles.photo, {width: this.props.size, height: this.props.size, borderRadius: this.props.size/2}, this.props.style]}
            source={{uri: photoUrl}}
        />;
    }
}

let styles = StyleSheet.create({
    photo: {
        backgroundColor: colors.lighterGrey
    }
});

export default Relay.createContainer(FacebookAvatar, {
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                facebookId
            }
        `
    }
});