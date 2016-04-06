import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import DebugView from '../common/DebugView';
import FacebookAvatar from '../common/FacebookAvatar';
import LikeButton from '../common/LikeButton';
import colors from '../../colors';
import LikeAnnotationCommentMutation from '../../mutations/LikeAnnotationComment';

class AnnotationComment extends Component {

    state = {
        inFlight: false
    };
    
    toggleLike() {
        // Bail if in-progress
        if (this.state.inFlight) return;
        // Create mutation
        const mutation = new LikeAnnotationCommentMutation({
            annotationComment: this.props.annotationComment
        });
        // Commit the update
        Relay.Store.commitUpdate(mutation, {
            onSuccess: (data) => {
                console.info('successfully liked annotation comment!', data);
                // Clear the text
                this.setState({inFlight: false});
            },
            onFailure: (transaction) => {
                let error = transaction.getError();
                console.error(error);
                console.info(transaction);
                alert('Error unliking this comment :-(');
                //this.refs.input.focus();
                this.setState({inFlight: false});
            }
        });
        this.setState({inFlight: true});
    }
    


    render() {
        return (
            <View style={styles.wrapper}>
                <FacebookAvatar user={this.props.annotationComment.user} size={24} />
                <View style={styles.content}>
                    <Text style={[styles.text, styles.name]}>{this.props.annotationComment.user.displayName}</Text>
                    <Text style={[styles.text]}>{this.props.annotationComment.text}</Text>
                </View>
                <LikeButton style={styles.likeButton}
                            onPress={this.toggleLike.bind(this)}
                            liked={this.props.annotationComment.viewerHasLiked}/>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1
        //height: 120,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingTop: 22,
        alignItems: 'flex-start'
    },
    content: {
        flex: 1
    },
    text: {
        flexDirection: 'column',
        marginLeft: 20,
        fontSize: 16,
        color: colors.lightGrey
    },
    name: {
        fontWeight: '600'
    },
    likeButton: {
        //backgroundColor: 'red',
        paddingRight: 12,
        paddingLeft: 12,
        paddingTop: 4,
        height: 60
    }
});

export default Relay.createContainer(AnnotationComment, {
    fragments: {
        annotationComment: () => Relay.QL`
            fragment on AnnotationComment {
                id
                text
                viewerHasLiked
                ${LikeAnnotationCommentMutation.getFragment('annotationComment')}
                user {
                    displayName
                    ${FacebookAvatar.getFragment('user')}
                }
            }
        `
    }
})