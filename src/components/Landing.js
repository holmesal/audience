import React, {
    Component,
    Image,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Login from './Login';

import colors from '../colors';

export default class Landing extends Component {

    render() {
        return (
            <ScrollView contentContainerStyle={styles.wrapper}>
                <Text style={styles.emoji}>🎧🙌</Text>
                <Text style={[styles.body, {fontWeight: '600', fontSize: 16, paddingLeft: 0}]}>Great to have you! Some things to know:</Text>
                <Text style={styles.body}>Feel free to share with any friends you like.</Text>
                <Text style={styles.body}>Your Podcastfoo friends come from your facebook friend list (for now).</Text>
                <Text style={styles.body}>Shake your device if you see something broken or have a cool idea.</Text>
                <Text style={[styles.body, {marginBottom: 40}]}>Podcastfoo is a code name.</Text>
                <Login onLogin={this.props.onLogin}/>
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 40,
        alignItems: 'center'
    },
    emoji: {
        fontSize: 50,
        marginTop: 80,
        marginBottom: 80
    },
    body: {
        color: colors.white,
        fontFamily: 'System',
        alignSelf: 'stretch',
        textAlign: 'left',
        marginBottom: 24,
        lineHeight: 20,
        paddingLeft: 0
    },
    login: {
        marginTop: 100
    }
});