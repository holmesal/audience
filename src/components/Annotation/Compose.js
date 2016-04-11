import React, {
    ActivityIndicatorIOS,
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
import CommentOnAnnotationMutation from '../../mutations/CommentOnAnnotation';
import DebugView from '../common/DebugView';
import colors from '../../colors';
import emojione from 'emojione';

class Compose extends Component {

    static propTypes = {
        onComment: PropTypes.func
    };

    static defaultProps = {
        onComment: () => {}
    };

    state = {
        text: '',
        inputHeight: 24,
        inFlight: false
    };

    handleChange(ev) {
        //console.info(ev.nativeEvent.contentSize.height)
        this.setState({inputHeight: ev.nativeEvent.contentSize.height})
    }

    addComment() {
        if (this.state.text.length < 1) return false;
        const emojified = emojione.toShort(this.state.text);
        console.info(`${this.state.text} ---> (emojify) ---> ${emojified}`);
        let mutation = new CommentOnAnnotationMutation({
            annotation: this.props.annotation,
            text: emojified
        });
        // Commit the update
        Relay.Store.commitUpdate(mutation, {
            onSuccess: () => {
                console.info('successfully added comment to annotation!');
                // Clear the text
                this.setState({
                    text: '',
                    inFlight: false
                });
                // Unfocus the keyboard
                this.refs.input.blur();
                // Notify parents
                this.props.onComment();
            },
            onFailure: (transaction) => {
                let error = transaction.getError();
                console.error(error);
                console.info(transaction)
                alert('Error adding your comment :-(');
                //this.refs.input.focus();
                this.setState({inFlight: false});
            }
        });
        this.refs.input.blur();
        this.setState({inFlight: true});
    }

    renderSendButton() {
        const buttonContents = this.state.inFlight ? <ActivityIndicatorIOS /> : <Text style={styles.send}>Send</Text>;
        return (
            <TouchableOpacity style={styles.sendButton} onPress={this.addComment.bind(this)}>
                <View style={{opacity: this.state.text.length < 1 ? 0.4 : 1}}>
                    {buttonContents}
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <TextInput onChangeText={text => this.setState({text})}
                           onChange={this.handleChange.bind(this)}
                           placeholder="Say something awesome"
                           style={[styles.input, {height: this.state.inputHeight + 6}]}
                           multiline
                           ref="input"
                           value={this.state.text}
                           autoFocus={this.props.autoFocus}
                />
                {this.renderSendButton()}
                {this.state.inFlight && <View style={styles.cover} />}
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
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: 'row',
        position: 'relative'
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
        width: 70,
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
    },
    cover: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: colors.lighterGrey,
        opacity: 0.4
    }
});

export default Relay.createContainer(Compose, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                ${CommentOnAnnotationMutation.getFragment('annotation')}
            }
        `
    }
})