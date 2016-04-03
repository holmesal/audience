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
import FacebookAvatar from '../common/FacebookAvatar';

class Comment extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <FacebookAvatar user={this.props.comment.user} size={24} />
                <View>
                    <Text style={[styles.text, styles.name]}>{this.props.comment.user.displayName}</Text>
                    <Text style={[styles.text]}>{this.props.comment.text}</Text>
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
        padding: 20,
        paddingTop: 22,
        paddingBottom: 0,
        alignItems: 'flex-start'
    },
    text: {
        flexDirection: 'column',
        marginLeft: 20,
        fontSize: 16,
        color: colors.lightGrey
    },
    name: {
        fontWeight: '600'
    }
});

export default Relay.createContainer(Comment, {
    fragments: {
        comment: () => Relay.QL`
            fragment on AnnotationComment {
                id
                text
                user {
                    displayName
                    ${FacebookAvatar.getFragment('user')}
                }
            }
        `
    }
})