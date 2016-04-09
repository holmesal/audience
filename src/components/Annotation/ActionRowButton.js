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

export default class ActionRowButton extends Component {

    static propTypes = {
        icon: PropTypes.string,
        label: PropTypes.string,
        iconColor: PropTypes.string
    };

    static defaultProps = {
        icon: 'help'
    };

    render() {
        return (
            <TouchableOpacity {...this.props} style={[styles.wrapper, this.props.style]}>
                <Icon name={this.props.icon}
                      size={20}
                      color={this.props.iconColor || colors.white}
                />
                <BoldCaps style={styles.label}>{this.props.label}</BoldCaps>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    label: {
        marginLeft: 8
    }
});