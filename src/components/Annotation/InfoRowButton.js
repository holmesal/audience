import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { BoldCaps } from '../../type';
import colors from '../../colors';
import Icon from 'react-native-vector-icons/Ionicons';

export default class InfoRowButton extends Component {

    static propTypes = {
        top: PropTypes.string,
        bottom: PropTypes.string
    };

    static defaultProps = {
        top: 'Top',
        bottom: 'Bottom'
    };

    render() {
        return (
            <TouchableOpacity {...this.props} style={styles.wrapper} activeOpacity={0.8}>
                <BoldCaps style={styles.top}>{this.props.top.toUpperCase()}</BoldCaps>
                <View style={styles.bottomWrapper}>
                    <Text style={styles.bottom} numberOfLines={1}>{this.props.bottom}</Text>
                    <Icon style={styles.arrow} name="arrow-right-c" color={colors.white} size={18} />
                </View>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 12,
        paddingRight: 12
    },
    top: {
        marginBottom: 4
    },
    bottom: {
        flex: 1,
        backgroundColor: 'transparent',
        color: colors.white
    },
    bottomWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    arrow: {
        marginLeft: 4,
        backgroundColor: 'transparent'
    }
});