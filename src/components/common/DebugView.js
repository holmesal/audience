import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class DebugView extends Component {

    static propTypes = {
        text: PropTypes.string
    };

    static defaultProps = {
        text: 'DebugView'
    };

    render() {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.text}>{this.props.text}</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        fontSize: 40
    },
});