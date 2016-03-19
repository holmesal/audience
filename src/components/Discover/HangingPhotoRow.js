import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import FacebookAvatar from '../common/FacebookAvatar';
import colors from '../../colors';

class HangingPhotoRow extends Component {

    static defaultProps = {
        isLast: false
    };

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.left}>
                    <View style={styles.rope} />
                    <FacebookAvatar
                        user={this.props.user}
                        size={24}
                        tint
                    />
                    {!this.props.isLast && <View style={[styles.rope, {flex: 1}]} />}
                </View>
                <View style={styles.right}>
                    {this.props.children}
                </View>
            </View>
        );
    }
}

const ropeLength = 24;

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        flexDirection: 'row'
    },
    left: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 64
    },
    rope: {
        width: 1,
        height: ropeLength,
        backgroundColor: colors.darkGreyLightContrast
    },
    right: {
        paddingTop: ropeLength,
        flex: 1
    }
});

export default Relay.createContainer(HangingPhotoRow, {
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                ${FacebookAvatar.getFragment('user')}
            }
        `
    }
});