import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    UIManager,
    View
} from 'react-native';
import Relay from 'react-relay';
import {prettyFormatTime} from '../../utils'
import FacebookAvatar from '../common/FacebookAvatar';

import Comment from './Comment';

class AnnotationListviewItem extends Component {

    render() {
        return (
            <Comment
                avatar={<FacebookAvatar user={this.props.annotation.user} size={32}/>}
                name={this.props.annotation.user.displayName}
                text={this.props.annotation.text}
            />
        );
    }
}

let styles = StyleSheet.create({
});

export default Relay.createContainer(AnnotationListviewItem, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                text
                time
                user {
                    displayName
                    ${FacebookAvatar.getFragment('user')}
                }
            }
        `
    }
});