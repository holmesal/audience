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
import { BoldCaps } from '../../type';

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
        const iconSize = this.props.caption ? 20 : 28;
        return this.props.liked ?
            <Icon name="ios-heart" color={colors.red} size={iconSize}/> :
            <Icon name="ios-heart-outline" color={colors.lighterGrey} size={iconSize}/>;
    }

    renderCaption() {
        if (this.props.caption) {
            return <BoldCaps style={styles.text}>LIKE{this.props.liked ? 'D' : ''}</BoldCaps>
        }
    }

    render() {
        const debugStyles = this.props.debug ? styles.debug : null;
        return (
            <TouchableOpacity {...this.props} style={[styles.button, this.props.style, debugStyles]}>
                {this.renderIcon()}
                {this.renderCaption()}
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        padding: 20,
        //backgroundColor: 'green'
    },
    debug: {
        borderWidth: 1,
        borderColor: 'red'
    },
    text: {
        color: colors.lightGrey,
        marginLeft: 8,
        marginTop: -2
    }
});