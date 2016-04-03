import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../colors';

export default class LikeButton extends Component {

    static propTypes = {
        debug: PropTypes.bool,
        liked: PropTypes.bool
    };

    static defaultProps = {
        debug: false,
        liked: false
    };

    renderIcon() {
        return this.props.liked ?
            <Icon name="ios-heart" color={colors.red} size={iconSize}/> :
            <Icon name="ios-heart-outline" color={colors.lighterGrey} size={iconSize}/>;
    }

    render() {
        const debugStyles = this.props.debug ? styles.debug : null;
        return (
            <TouchableOpacity {...this.props} style={[styles.button, this.props.style, debugStyles]}>
                {this.renderIcon()}
            </TouchableOpacity>
        );
    }
}

const iconSize = 28;
let styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20
    },
    debug: {
        borderWidth: 1,
        borderColor: 'red'
    }
});