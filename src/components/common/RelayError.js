import React, {
    Component,
    Image,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import colors from '../../colors';
import RoundButton from './RoundButton';

export default class RelayError extends Component {

    static propTypes = {};

    static defaultProps = {};

    render() {
        console.info('relay error rendering!');
        return (
            <ScrollView style={{flex: 1}} contentContainerStyle={styles.wrapper}>
                <Text style={styles.emoji}>🤔🛰🔥</Text>
                <Text style={styles.subheading}>Request failed.</Text>
                <Text style={styles.subheading}>Are you sure you have internets?</Text>

                <RoundButton
                    onPress={this.props.retry}
                    label="RETRY"
                    style={styles.button}
                />

                <Text style={[styles.error, {marginTop: 40}]}>Error details:</Text>
                <Text style={styles.error}>{this.props.error.message}</Text>
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    emoji: {
        fontSize: 40,
        marginBottom: 20
    },
    subheading: {
        fontFamily: 'System',
        fontSize: 16,
        color: colors.white,
        fontWeight: '300',
        lineHeight: 24
    },
    button: {
        marginTop: 32
    },
    error: {
        fontSize: 14,
        color: colors.white,
        opacity: 0.8
    }
});