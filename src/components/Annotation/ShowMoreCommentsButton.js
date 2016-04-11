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

export default class ShowMoreCommentsButton extends Component {

    static propTypes = {
        moreCount: PropTypes.number
    };

    static defaultProps = {
        moreCount: 0
    };

    render() {
        return (
            <TouchableOpacity {...this.props} style={styles.wrapper}>
                <Text style={styles.text}>See {this.props.moreCount} more comment{this.props.moreCount > 1 ? 's' : ''}</Text>
                <Icon style={styles.icon} name="arrow-right-c" color={colors.lightGrey} size={18} />
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        height: 44,
        backgroundColor: colors.darkGreyLightContrast,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    text: {
        color: colors.lightGrey,
        fontSize: 14
    },
    icon: {
        marginBottom: -2,
        marginLeft: 8
    }
});