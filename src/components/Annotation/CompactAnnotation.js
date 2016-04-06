import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import PlayClipButton from './PlayClipButton';
import DebugView from '../common/DebugView';
import colors from '../../colors';
import FacebookAvatar from '../common/FacebookAvatar';
import LikeAnnotationMutation from '../../mutations/LikeAnnotation';
import LikeButton from '../common/LikeButton';
import PrettyArtwork from '../common/PrettyArtwork';

class CompactAnnotation extends Component {

    state = {
        inFlight: false
    };

    toggleLike() {
        // Bail if in-progress
        if (this.state.inFlight) return;
        // Create mutation
        const mutation = new LikeAnnotationMutation({
            annotation: this.props.annotation
        });
        // Commit the update
        Relay.Store.commitUpdate(mutation, {
            onSuccess: (data) => {
                console.info('successfully liked annotation!', data);
                // Clear the text
                this.setState({inFlight: false});
            },
            onFailure: (transaction) => {
                let error = transaction.getError();
                console.error(error);
                console.info(transaction);
                alert('Error unliking this annotation :-(');
                //this.refs.input.focus();
                this.setState({inFlight: false});
            }
        });
        this.setState({inFlight: true});
    }

    render() {
        return (
            <View style={styles.wrapper}>

                <PrettyArtwork podcast={this.props.annotation.episode.podcast} />

                <FacebookAvatar user={this.props.annotation.user} />

                <View style={styles.textWrapper}>
                    <Text style={[styles.text, styles.name]}>{this.props.annotation.user.displayName}</Text>
                    <Text style={[styles.text, styles.body]}>{this.props.annotation.text}</Text>
                </View>

                {this.props.annotation.clip && <PlayClipButton
                    clip={this.props.annotation.clip}
                />}

                <LikeButton style={styles.likeButton}
                            onPress={this.toggleLike.bind(this)}
                            liked={this.props.annotation.viewerHasLiked} />


            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        backgroundColor: colors.darkGreyLightContrast,
        paddingLeft: 12,
        alignItems: 'center'
    },

    textWrapper: {
        padding: 20,
        flex: 1
    },
    text: {
        fontFamily: 'System',
        color: colors.lightGrey
    },
    name: {
        fontWeight: '500'
    }
});

export default Relay.createContainer(CompactAnnotation, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                text
                viewerHasLiked
                ${LikeAnnotationMutation.getFragment('annotation')}
                user {
                    displayName
                    ${FacebookAvatar.getFragment('user')}
                }
                clip {
                    ${PlayClipButton.getFragment('clip')}
                }
                episode {
                    podcast {
                        ${PrettyArtwork.getFragment('podcast')}
                    }
                }
            }
        `
    }
})