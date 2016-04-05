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

export default class TabBarItem extends Component {

    static propTypes = {
        label: PropTypes.string,
        icon: PropTypes.string,
        active: PropTypes.bool
    };

    static defaultProps = {
        label: 'SomeTab',
        icon: 'ios-help-outline',
        active: false
    };

    render() {
        const activeTextStyles = this.props.active ? styles.activeLabel : null;
        const iconColor = this.props.active ? colors.attention : colors.grey;
        return (
            <TouchableOpacity style={styles.wrapper} onPress={this.props.onPress}>
                <Icon name={this.props.icon}
                      color={iconColor}
                      size={28} />
                <Text style={[styles.label, activeTextStyles]}>
                    {this.props.label}
                </Text>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    label: {
        color: colors.grey
    },
    activeLabel: {
        color: colors.attention
    }
});