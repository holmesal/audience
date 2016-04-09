import React, {
    ActionSheetIOS,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import ActionRowButton from './ActionRowButton';
import DebugView from '../common/DebugView';
import colors from '../../colors';
import LikeAnnotationMutation from '../../mutations/LikeAnnotation';
import { annotationShareLink } from '../../utils/urls';

class ActionRow extends Component {

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

    addComment() {

    }

    shareAnnotation() {
        const url = annotationShareLink(this.props.annotation.id);
        ActionSheetIOS.showShareActionSheetWithOptions({
                url
            }, err => console.error,
            (success, method) => {
                if (success) {
                    console.info(`shared via ${method}`);
                } else {
                    console.info('cancelled share');
                }
            })
    }

    render() {
        const likeIcon = this.props.annotation.viewerHasLiked ? 'ios-heart' : 'ios-heart-outline';
        const likeColor = this.props.annotation.viewerHasLiked ? colors.red : colors.white;
        return (
            <View style={styles.wrapper}>
                <ActionRowButton onPress={this.toggleLike.bind(this)} icon={likeIcon} iconColor={likeColor} label="LIKE" />
                <ActionRowButton onPress={this.addComment.bind(this)} icon="chatbox-working" label="COMMENT" />
                <ActionRowButton onPress={this.shareAnnotation.bind(this)} icon="reply" label="SHARE" />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)',
        height: 42
    },
    button: {
        flex: 1
    }
});

export default Relay.createContainer(ActionRow, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                viewerHasLiked
                ${LikeAnnotationMutation.getFragment('annotation')}
            }
        `
    }
})