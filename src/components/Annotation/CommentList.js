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
import colors from '../../colors';
import Comment from './Comment';

class CommentList extends Component {

    renderComments() {
        return _.map(this.props.annotation.comments.edges.reverse(), edge => <Comment key={edge.node.id} comment={edge.node} />)
    }

    render() {
        return (
            <View style={styles.wrapper}>
                {this.renderComments()}
            </View>
        )
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1,
        paddingBottom: 22
    }
});

export default Relay.createContainer(CommentList, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                comments(first:100) {
                    edges {
                        node {
                            ... on AnnotationComment {
                                id
                                ${Comment.getFragment('comment')}
                            }
                        }
                    }
                }
            }
        `
    }
})