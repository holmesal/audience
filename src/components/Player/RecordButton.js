import React, {
    ActionSheetIOS,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {PFAudio} from 'NativeModules';
import Relay from 'react-relay';
import colors from '../../colors';

export default class RecordButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    startRecording() {
        PFAudio.startRecording()
    }

    endRecording() {
        PFAudio.stopRecording((err, filepath) => {
            console.info('got filepath!', filepath);
            alert(`got filepath: ${filepath}`);
        });
    }

    render() {
        return (
            <TouchableOpacity
                onPressIn={this.startRecording.bind(this)}
                onPressOut={this.endRecording.bind(this)}
            >
                <Image style={styles.buttonImage} source={require('image!buttonRecord')} />
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    buttonImage: {
        width: 90,
        height: 90
    }
});

export default Relay.createContainer(RecordButton, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
            }
        `
    }
});