import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import colors from '../../colors';

export default class RoundButton extends Component {

    static propTypes = {
        label: React.PropTypes.string,
        onPress: React.PropTypes.func
    };

    static defaultProps = {};

    render() {
        return (
            <TouchableOpacity
                style={[styles.wrapper, this.props.style]}
                onPress={this.props.onPress}
            >
                <Text style={styles.label}>{this.props.label}</Text>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.attention,
        height: 52,
        width: 240,
        borderRadius: 25,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'

    },
    label: {
        fontFamily: 'System',
        color: colors.white,
        fontSize: 18,
        fontWeight: '300',
        letterSpacing: 1.5
    }
});