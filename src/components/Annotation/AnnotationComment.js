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
    
    renderLikeCount() {
        const { likeCount } = this.props.annotationComment;
        if (likeCount > 0) {
            return <Text style={styles.likeCount}>{likeCount} like{likeCount > 1 ? 's' : ''}</Text>
        }
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <FacebookAvatar user={this.props.annotationComment.user} size={54} />
                <View style={styles.triangle} />
                <View style={styles.content}>
                    <Text style={[styles.text, styles.name]}>{this.props.annotationComment.user.displayName}</Text>
                    <Text style={[styles.text]}>{this.props.annotationComment.text}</Text>
                    <View style={styles.likeRow}>
                        <LikeButton style={styles.likeButton}
                                    caption
                                    onPress={this.toggleLike.bind(this)}
                                    liked={this.props.annotationComment.viewerHasLiked}/>
                        {this.renderLikeCount()}
                    </View>
                </View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1
        //height: 120,
        flexDirection: 'row',
        //paddingLeft: 20,
        marginTop: 4,
        alignItems: 'flex-start',
        marginBottom: 4
    },
    triangle: {
        width: 0,
        height: 0,
        marginLeft: 2,
        //backgroundColor: colors.darkGreyLightContrast,
        backgroundColor: 'transparent',
        borderRightWidth: 6,
        borderTopWidth: 0,
        borderBottomWidth: 8,
        borderLeftWidth: 0,
        borderRightColor: colors.darkGreyLightContrast,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent'
    },
    content: {
        flex: 1,
        backgroundColor: colors.darkGreyLightContrast,
        padding: 12,
        borderRadius: 2
    },
    text: {
        flexDirection: 'column',
        //marginLeft: 20,
        fontSize: 14,
        lineHeight: 16,
        marginBottom: 8,
        color: colors.lightGrey
    },
    name: {
        fontWeight: '600'
    },
    likeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'center',
        //backgroundColor: 'red'
    },
    likeButton: {
        padding: 0,
        paddingTop: 8,
        flex: 1
        //paddingRight: 12,
        //paddingLeft: 12,
        //paddingTop: 4,
        //height: 60
    },
    likeCount: {
        color: colors.lightGrey,
        marginBottom: -6
    }
});

export default Relay.createContainer(AnnotationComment, {
    fragments: {
        annotationComment: () => Relay.QL`
            fragment on AnnotationComment {
                id
                text
                likeCount
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