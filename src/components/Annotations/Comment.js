import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import colors from '../../colors';

export default class Comment extends Component {

    static propTypes = {
        name: PropTypes.string,
        avatar: PropTypes.node,
        text: PropTypes.string
    };

    render() {
        return (
            <View style={styles.wrapper} onLayout={this.props.onLayout}>
                {this.props.avatar}
                <View style={styles.content}>
                    <Text style={styles.name} numberOfLines={1}>{this.props.name}</Text>
                    <Text style={styles.text} numberOfLines={5}>{this.props.text}</Text>
                </View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        paddingLeft: 12,
        alignSelf: 'stretch',
        paddingBottom: 12,
        marginBottom: 6
    },
    content: {
        marginLeft: 12,
        paddingRight: 12,
        flex: 1
    },
    name: {
        fontFamily: 'System',
        color: colors.grey,
        fontWeight: '500',
        letterSpacing: 0.3
    },
    text: {
        fontFamily: 'Charter',
        color: colors.darkGrey,
        fontSize: 18,
        lineHeight: 24
    }
});