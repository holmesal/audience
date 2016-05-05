import React, {
    Animated,
    Component,
    DeviceEventEmitter,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import colors from '../../colors';
import emojione from 'emojione';
import Relay from 'react-relay';
import AnnotateEpisodeMutation from '../../mutations/AnnotateEpisode';
import Mixpanel from 'react-native-mixpanel';
import {connect} from 'react-redux';
import {currentTime$, updateSendingComment} from '../../redux/modules/player.js';
import store from '../../redux/create';
import Highlight from '../Highlight/Highlight';

class CommentCompose extends Component {

    static propTypes = {};

    static defaultProps = {
        hide: () => {}
    };

    state = {
        text: '',
        paddingBottom: new Animated.Value(0),
        keyboardHeight: 0,
        inFlight: false,
        currentTime: null
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible && !this.props.visible) {
            this.setState({currentTime: currentTime$(store.getState())})
        }
    }

    componentWillMount() {
        this._keyboardShowSub = DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        this._keyboardHideSub = DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    }

    componentWillUpdate(nextProps, nextState) {
        this._keyboardShowSub.remove();
        this._keyboardHideSub.remove();
    }

    keyboardWillShow(ev) {
        console.info('keyboardWillShow: ', ev);
        this.setState({keyboardHeight: ev.endCoordinates.height});
    }

    keyboardWillHide() {
        this.setState({keyboardHeight: 0});
    }

    componentDidUpdate(prevProps, prevState) {
        console.info('did update!', this.state.keyboardHeight, this.props.scrubberHeight)
        Animated.spring(this.state.paddingBottom, {
            toValue: this.state.keyboardHeight
        }).start();
    }

    submit() {
        let currentTime = this.state.currentTime;
        console.info(this.state.text, currentTime);

        const emojified = emojione.toShort(this.state.text);
        console.info(`${this.state.text} ---> (emojify) ---> ${emojified}`);

        // Create the mutation
        let mutation = new AnnotateEpisodeMutation({
            episode: this.props.episode,
            time: currentTime,
            text: emojified
        });

        // Commit the update
        Relay.Store.commitUpdate(mutation, {
            onSuccess: () => {
                console.info('successfully annotated episode!');
                this.props.hide();
                // Clear the text
                this.setState({
                    inFlight: false,
                    text: ''
                });
                store.dispatch(updateSendingComment(false));
            },
            onFailure: (transaction) => {
                let error = transaction.getError();
                console.error(error);
                alert('Error adding your comment :-(');
                this.setState({inFlight: false});
                store.dispatch(updateSendingComment(false));
            }
        });

        // Update the ui to reflect in-flight request
        this.setState({inFlight: true});
        this.props.hide();
        store.dispatch(updateSendingComment(true));
    }

    close() {
        this.setState({comment: ''});
        this.props.hide();
    }

    handleTextChange(text) {
        if (text.length < 240) this.setState({text})
    }

    renderTopRow() {
        let sendText = this.state.inFlight ? 'Sending...' : 'Send';
        let disabled = this.state.inFlight || this.state.text.length < 1;
        let sendOpacity = disabled ? 0.5 : 1;
        let sendTarget = disabled ? null : this.submit.bind(this);
        return (
            <View style={styles.topRow}>
                <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={this.close.bind(this)}>
                    <Icon name="close-round" size={24} color={colors.lighterGrey}/>
                </TouchableOpacity>
                <View style={{flex: 1}} />
                <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={sendTarget}>
                    <Text style={[styles.sendText, {opacity: sendOpacity}]}>{sendText}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        if (!this.props.visible) return <View />;
        return (
            <Animated.View style={[styles.inputWrapper, {paddingBottom: this.state.paddingBottom}]}>
                {this.renderTopRow()}
                <TextInput style={styles.input}
                           placeholder="Say something great..."
                           placeholderTextColor="grey"
                           multiline
                           value={this.state.text}
                           autoFocus
                           keyboardDismissMode="interactive"
                           keyboardAppearance="dark"
                           onChangeText={this.handleTextChange.bind(this)}
                />
                <Highlight episodeDuration={1000 * 60 * 60 * 3} initialEndTime={30000} />
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    inputWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.white
    },
    topRow: {
        flexDirection: 'row'
    },
    button: {
        paddingTop: 32
    },
    closeButton: {
        //backgroundColor: 'red',
        padding: 20,
        paddingTop: 32
    },
    sendButton: {
        //backgroundColor: 'green',
        padding: 20
    },
    sendText: {
        color: colors.attention,
        fontFamily: 'System',
        fontWeight: '600',
        fontSize: 18
    },
    input: {
        flex: 1,
        backgroundColor: 'red',
        //marginTop: 40,
        color: colors.lightGrey,
        alignSelf: 'stretch',
        //height: 100,
        //borderWidth: 1,
        //borderRadius: 8,
        //borderColor: 'rgba(255,255,255,0.1)',
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 18,
        fontFamily: 'System',
        lineHeight: 25
    },
    textButton: {
        flex: 1,
        //backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    textButtonText: {
        fontSize: 16,
        color: 'white'
    }
});

export default Relay.createContainer(CommentCompose, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                ${AnnotateEpisodeMutation.getFragment('episode')}
            }
        `
    }
});