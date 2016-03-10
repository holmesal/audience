import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import Relay from 'react-relay';
import AnnotateEpisodeMutation from '../../mutations/AnnotateEpisode';
import store from '../../redux/create';
import {currentTime$} from '../../redux/modules/player';
import colors from '../../colors';

class Compose extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        text: '',
        inFlight: false
    };

    submit() {
        let currentTime = currentTime$(store.getState());
        console.info(this.state.text, currentTime);

        // Create the mutation
        let mutation = new AnnotateEpisodeMutation({
            episode: this.props.episode,
            time: currentTime,
            text: this.state.text
        });

        // Commit the update
        Relay.Store.update(mutation, {
            onSuccess: () => {
                console.info('successfully annotated episode!');
                // Clear the text
                this.setState({
                    inFlight: false,
                    text: ''
                });
            },
            onFailure: (transaction) => {
                let error = transaction.getError();
                console.error(error);
                alert('Error adding your comment :-(');
                this.setState({inFlight: false});
            }
        });

        // Update the ui to reflect in-flight request
        this.setState({inFlight: true})
    }

    // TODO - make this a multiline auto-resizing text input when on the latest react-native steez
    // https://github.com/facebook/react-native/commit/481f560f64806ba3324cf722d6bf8c3f36ac74a5
    render() {
        return (
            <View style={styles.wrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Say something awesome..."
                    onChangeText={text => this.setState({text})}
                    value={this.state.text}
                    editable={!this.state.inFlight}
                    onSubmitEditing={this.submit.bind(this)}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12
    },
    input: {
        backgroundColor: '#F7F7F7',
        borderColor: colors.lighterGrey,
        borderRadius: 7,
        height: 36,
        paddingLeft: 12,
        paddingRight: 12
    }
});

export default Relay.createContainer(Compose, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                ${AnnotateEpisodeMutation.getFragment('episode')}
            }
        `
    }
});