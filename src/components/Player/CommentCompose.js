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

import Mixpanel from 'react-native-mixpanel';
import {connect} from 'react-redux/native';
import {share$, currentTime$} from '../../redux/modules/player.js';
import store from '../../redux/create.js';

class CommentCompose extends Component {

    static propTypes = {};

    static defaultProps = {
        visible: true
    };

    state = {
        comment: ''
    };

    comment() {
        let {podcastId, episodeId} = this.props;
        let episodeTime = Math.round(currentTime$(store.getState()));
        Mixpanel.trackWithProperties('Leave Comment', {
            podcastId,
            episodeId,
            episodeTime,
            commentLength: this.state.comment.length
        });
        this.hideCompose();
    }

    hideCompose() {
        this.setState({comment: ''});
        this.props.hideCompose();
    }

    render() {
        if (!this.props.visible) return <View />;
        return (
            <View style={styles.inputWrapper}>
                <TextInput style={styles.input}
                           placeholder="Say something awesome..."
                           placeholderTextColor="grey"
                           multiline
                           value={this.state.comment}
                           autoFocus
                           onChangeText={(comment) => this.setState({comment})}
                />
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.textButton} onPress={this.hideCompose.bind(this)}><Text style={styles.textButtonText}>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.textButton} onPress={this.comment.bind(this)}><Text style={[styles.textButtonText, {color: '#29B6F6', fontWeight: '600'}]}>Send</Text></TouchableOpacity>
                </View>
            </View>
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
        height: 700,
        backgroundColor: 'rgba(29,29,29,0.9)',
        padding: 20
    },
    input: {
        marginTop: 40,
        color: 'white',
        alignSelf: 'stretch',
        height: 100,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 8,
        fontSize: 16
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

export default connect(share$)(CommentCompose);