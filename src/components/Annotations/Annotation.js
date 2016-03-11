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

class Annotation extends Component {

    render() {
        return (
            <Comment
                avatar={<FacebookAvatar user={this.props.annotation.user} size={32}/>}
                name={this.props.annotation.user.displayName}
                text={`${this.props.annotation.text} [${prettyFormatTime(Math.round(this.props.annotation.time))}`}
            />
        );
    }
}

let styles = StyleSheet.create({
    //wrapper: {
    //    flexDirection: 'row',
    //    paddingLeft: 12,
    //    alignSelf: 'stretch',
    //    paddingBottom: 12,
    //    marginBottom: 6
    //},
    //photo: {
    //    marginRight: 12
    //},
    //content: {
    //    flex: 1
    //},
    //name: {
    //    fontFamily: 'System',
    //    color: colors.grey,
    //    fontWeight: '500',
    //    letterSpacing: 0.3
    //},
    //text: {
    //    fontFamily: 'Charter',
    //    color: colors.darkGrey,
    //    fontSize: 18,
    //    lineHeight: 24
    //}
});

export default Relay.createContainer(Annotation, {
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