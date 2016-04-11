import React, {
    Component,
    Image,
    NavigationExperimental,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

const {
    Container: NavigationContainer
} = NavigationExperimental;
import {showAnnotation} from '../Nav/tabs/Feed';

import DebugView from '../common/DebugView';
import colors from '../../colors';
import CompactAnnotation from '../Annotation/CompactAnnotation';
import AnnotationComment from '../Annotation/AnnotationComment';
import ShowMoreCommentsButton from '../Annotation/ShowMoreCommentsButton';


class Annotation extends Component {

    renderTopComment() {
        const topComment = this.props.annotationActivity.annotation.topComment;
        if (topComment) {
            return (
                <AnnotationComment annotationComment={topComment} />
            )
        }
    }

    renderMoreCommentsButton() {
        const {commentCount} = this.props.annotationActivity.annotation;
        if (commentCount > 1) {
            return <ShowMoreCommentsButton style={styles.moreComments} moreCount={commentCount-1} onPress={ev => this.showAnnotation(false)} />
        }
    }

    showAnnotation(focusInput) {
        this.props.onNavigate({
            type: 'rootStack.showAnnotation',
            annotationId: this.props.annotationActivity.annotation.id,
            focusInput
        });
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <CompactAnnotation annotation={this.props.annotationActivity.annotation}
                                   onCommentPress={ev => this.showAnnotation(true)} />
                {this.renderTopComment()}
                {this.renderMoreCommentsButton()}
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    moreComments: {
        marginLeft: 62
    }
});

const contained = NavigationContainer.create(Annotation);

export default Relay.createContainer(contained, {
    fragments: {
        annotationActivity: () => Relay.QL`
            fragment on AnnotationActivity {
                id
                annotation {
                    id
                    ${CompactAnnotation.getFragment('annotation')}
                    topComment {
                        ${AnnotationComment.getFragment('annotationComment')}
                    }
                    commentCount
                }
            }
        `
    }
})