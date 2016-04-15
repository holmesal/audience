import React, {
    Component,
    Image,
    NavigationExperimental,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Relay from 'react-relay';

import DebugView from '../common/DebugView';
import TouchableFade from '../common/TouchableFade';
import FacebookAvatar from '../common/FacebookAvatar';
import colors from '../../colors';
import moment from 'moment-twitter';
import emojione from 'emojione';

const {
    Container: NavigationContainer
} = NavigationExperimental;

const firstThree = text => {
    const split = text.split(' ');
    let sliced = split.slice(0,3).join(' ');
    if (split.length > 3) sliced += '...';
    return sliced
};

class NotificationItem extends Component {

    renderNotificationBody() {
        const {notification} = this.props;
        switch (this.props.notification.__typename) {
            case 'NotificationLikedAnnotation':
                return `liked your comment "${firstThree(notification.annotation.text)}"`;
            case 'NotificationCommentedOnAnnotation':
                return `replied to your comment "${firstThree(notification.annotationComment.annotation.text)}"`;
            case 'NotificationLikedAnnotationComment':
                return `liked your reply "${firstThree(notification.annotationComment.text)}"`;
            case 'NotificationAlsoCommentedOnAnnotation':
                return `also replied to "${firstThree(notification.annotationComment.annotation.text)}"`;
            default:
                return `(oops - unknown notification type: ${this.props.notification.__typename})`
        }
    }

    handlePress() {
        const showAnnotation = annotationId => ({
            type: 'rootStack.showAnnotation',
            annotationId
        });
        const {notification, onNavigate} = this.props;
        console.info('pressed notification: ', notification);
        switch (notification.__typename) {
            case 'NotificationLikedAnnotation':
                onNavigate(showAnnotation(notification.annotation.id));
                break;
            case 'NotificationCommentedOnAnnotation':
                onNavigate(showAnnotation(notification.annotationComment.annotation.id));
                break;
            case 'NotificationLikedAnnotationComment':
                onNavigate(showAnnotation(notification.annotationComment.annotation.id));
                break;
            case 'NotificationAlsoCommentedOnAnnotation':
                onNavigate(showAnnotation(notification.annotationComment.annotation.id));
                break;
            default:
                console.error(`could not navigate for unknown notification type: ${this.props.notification.__typename}`)
        }
    }

    render() {
        const { notification } = this.props;
        return (
            <TouchableFade style={styles.wrapper}
                           onPress={this.handlePress.bind(this)}
                           underlayColor={colors.darkGreyLightContrast}
            >
                <FacebookAvatar style={styles.avatar} user={this.props.notification.source} size={54} />
                <View style={styles.content}>
                    <Text style={[styles.text, styles.body]}>
                        <Text style={styles.name}>{this.props.notification.source.displayName} </Text>
                        {emojione.shortnameToUnicode(this.renderNotificationBody())}
                    </Text>
                    <Text style={[styles.text, styles.timestamp]}>{moment(new Date(this.props.notification.created)).twitterLong()}</Text>
                </View>
            </TouchableFade>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        padding: 24
    },
    content: {
        flex: 1
    },
    avatar: {
        marginRight: 24
    },
    text: {
        fontFamily: 'System',
        color: colors.white,
        fontSize: 14
    },
    body: {
        lineHeight: 18
    },
    name: {
        fontWeight: '700'
    },
    timestamp: {
        fontSize: 11
    }
});

const contained = NavigationContainer.create(NotificationItem);

export default Relay.createContainer(contained, {
    fragments: {
        notification: () => Relay.QL`
            fragment on Notification {
                __typename
                ... on NotificationLikedAnnotation {
                    created
                    source {
                        displayName
                        ${FacebookAvatar.getFragment('user')}
                    }
                    annotation {
                        id
                        text
                    }
                }

                ... on NotificationCommentedOnAnnotation {
                    created
                    source {
                        displayName
                        ${FacebookAvatar.getFragment('user')}
                    }
                    annotationComment {
                        annotation {
                            id
                            text
                        }
                    }
                }

                ... on NotificationLikedAnnotationComment {
                    created
                    source {
                        displayName
                        ${FacebookAvatar.getFragment('user')}
                    }
                    annotationComment {
                        text
                        annotation {
                            id
                        }
                    }
                }

                ... on NotificationAlsoCommentedOnAnnotation {
                    created
                    source {
                        displayName
                        ${FacebookAvatar.getFragment('user')}
                    }
                    annotationComment {
                        annotation {
                            id
                            text
                        }
                    }
                }

            }
        `
    }
})