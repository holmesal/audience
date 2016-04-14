import React, {
    Component,
    Image,
    NativeAppEventEmitter,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { createSelector } from 'reselect';
import { player$, finishedPlaying } from '../../redux/modules/clip';
import { connect } from 'react-redux';
import { MTAudioClip } from 'NativeModules';
import {BUCKET} from '../../utils/urls';

class ClipPlayer extends Component {

    componentDidMount() {
        this._audioStateSubscription = NativeAppEventEmitter.addListener('MTAudioClip.updateState', this.handleUpdateState.bind(this));
        this._audioFinishedSubscription = NativeAppEventEmitter.addListener('MTAudioClip.finishedPlaying', this.handleFinishedPlaying.bind(this));
    }

    componentWillUnmount() {
        this._audioStateSubscription.remove();
        this._audioFinishedSubscription.remove();
    }

    handleUpdateState(s) {
        console.info('clip player saw native audio state change: ', s)
    }

    handleFinishedPlaying(s) {
        console.info('clip player saw native audio finish playing');
        this.props.dispatch(finishedPlaying())
    }

    componentDidUpdate(prevProps, prevState) {
        // Play the clip when the clip id changes
        if (this.props.clipId && prevProps.clipId != this.props.clipId) {
            MTAudioClip.play(this.getSource(this.props.clipId));
        // Ignore these changes when beginning to play
        } else {
            if (this.props.playing != prevProps.playing) {
                if (this.props.playing) MTAudioClip.resume()
                else MTAudioClip.pause()
            }
        }
    }

    getSource(clipId) {
        return `http://s3-us-west-1.amazonaws.com/${BUCKET}/${clipId}.mp3`;
    }

    render() {
        return <View />;
    }
}

export default connect(player$)(ClipPlayer);

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});