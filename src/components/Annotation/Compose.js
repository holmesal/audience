import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Relay from 'react-relay';

import DebugView from '../common/DebugView';
import colors from '../../colors';

class Compose extends Component {

    state = {
        text: null,
        inputHeight: 24
    };

    handleChange(ev) {
        //console.info(ev.nativeEvent.contentSize.height)
        this.setState({inputHeight: ev.nativeEvent.contentSize.height})
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <TextInput onChangeText={text => this.setState({text})}
                           onChange={this.handleChange.bind(this)}
                           placeholder="Say something awesome"
                           style={[styles.input, {height: this.state.inputHeight + 6}]}
                           multiline
                />
                <TouchableOpacity style={styles.sendButton}>
                    <Text style={styles.send}>Send</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        backgroundColor: colors.lighterGrey,
        //height: 40,
        padding: 4,
        flexDirection: 'row'
    },
    input: {
        alignSelf: 'stretch',
        flex: 1,
        backgroundColor: colors.lightGrey,
        borderRadius: 4,
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: 16
    },
    sendButton: {
        //backgroundColor: '#4dbbc9',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 4,
        paddingBottom: 4
    },
    send: {
        color: colors.attention,
        fontWeight: '600',
        fontSize: 16
    }
});

export default Relay.createContainer(Compose, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
            }
        `
    }
})