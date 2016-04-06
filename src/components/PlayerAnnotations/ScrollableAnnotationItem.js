import React, {
    AppStateIOS,
    Animated,
    Component,
    Dimensions,
    Image,
    NavigationExperimental,
    PropTypes,
    PushNotificationIOS,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Relay from 'react-relay';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../colors';
import emoji from 'node-emoji';
import LikeButton from '../common/LikeButton';
import {getTintForUser, tintOpacity} from '../../utils/tints';
import {getViewerId} from '../../utils/relay';
import {showAnnotation} from '../Nav/PlayerRootStack';
import LikeAnnotationMutation from '../../mutations/LikeAnnotation';

export default class ScrollableAnnotationItem extends Component {

    state = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
        cardHeight: null,
        likeInFlight: false
    };

    _fadeOutBeginTimeout = null;

    componentWillMount() {
        //console.info('should show notification? ', this.props.annotation.user.id, getViewerId());
        if (__DEV__ || this.props.annotation.user.id != getViewerId()) {
            this.showPushNotification();
        }
    }

    showPushNotification() {
        // TODO - remove this once https://github.com/facebook/react-native/pull/4003/files lands
        PushNotificationIOS.cancelAllLocalNotifications();

        //console.info('showing notificaton!');
        let alertBody = `${this.props.annotation.user.displayName.split(' ')[0]}: ${emoji.emojify(this.props.annotation.text)}`;
        PushNotificationIOS.presentLocalNotification({
            alertBody,
            userInfo: {
                annotationId: this.props.annotation.id
            }
        });
        //setTimeout(() => {
        //    this.removePushNotification();
        //}, 5000);
    }

    removePushNotification() {
        PushNotificationIOS.cancelAllLocalNotifications();
        // TODO - waiting for https://github.com/facebook/react-native/pull/4003/files
        //PushNotificationIOS.cancelLocalNotifications({
        //    annotationId: this.props.annotation.id
        //});
    }

    handleLayout(ev) {
        let cardWidth = ev.nativeEvent.layout.width;
        let cardHeight = ev.nativeEvent.layout.height;
        //console.info('laid out!', cardWidth, cardHeight);

        // Animate in the container height
        Animated.spring(this.state.height, {
            toValue: cardHeight + marginTop,
            tension: 80,
            friction: 10
        }).start();

        // Fade in the contents
        Animated.spring(this.state.opacity, {
            toValue: 1
        }).start(() => {
            // When finished, begin fading out in 10 seconds
            setTimeout(this.beginFadeOut.bind(this), 5000)
        });

        // Figure out if this card should flex
        //let cardShouldFlex = this.state.cardShouldFlex;
        //if (likeTouchableWidth + cardWidth + marginRight > Dimensions.get('window').width && !this.state.measured) {
        //    console.info('should flex!');
        //    cardShouldFlex = true;
        //}
        this.setState({cardHeight})
    }

    handleTextLayout(ev) {
        //console.info(ev.nativeEvent.layout.width)
    }

    beginFadeOut() {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 10000
        }).start()
    }

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
                this.setState({likeInFlight: false});
            },
            onFailure: (transaction) => {
                let error = transaction.getError();
                console.error(error);
                console.info(transaction);
                alert('Error unliking this annotation :-(');
                //this.refs.input.focus();
                this.setState({likeInFlight: false});
            }
        });
        this.setState({likeInFlight: true});
    }

    handlePress() {
        this.props.onNavigate(showAnnotation(this.props.annotation.id))
    }

    render() {
        let flex = this.props.annotation.text.length > 25 ? 1 : 0;
        const photoUrl = `http://graph.facebook.com/v2.5/${this.props.annotation.user.facebookId}/picture?type=square&height=${this.state.cardHeight * 2}`;
        return (
            <Animated.View style={[styles.wrapper, {
                height: this.state.height,
                opacity: this.state.opacity
            }]}>
                <View style={[styles.row, {height: this.state.cardHeight}]}>
                    <LikeButton style={styles.likeTouchable}
                                onPress={this.toggleLike.bind(this)}
                                liked={this.props.annotation.viewerHasLiked}/>
                    <TouchableOpacity style={[styles.card, {flex}]}
                                      onLayout={this.handleLayout.bind(this)}
                                      onPress={this.handlePress.bind(this)}>
                        <Image
                            source={{uri: photoUrl}}
                            style={[styles.image, {height: this.state.cardHeight || 0}]}
                        >
                            <View
                                style={[styles.tint, {
                                    backgroundColor: getTintForUser(this.props.annotation.user.id)
                                }]}
                            />
                        </Image>
                        <Text style={styles.text} onLayout={this.handleTextLayout.bind(this)}>{emoji.emojify(this.props.annotation.text)}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    }

    componentWillUnmount() {
        clearTimeout(this._fadeOutBeginTimeout);
        // Remove notifications
        //console.info('removing notification');
        //this.removePushNotification();
        //PushNotificationIOS.cancelAllLocalNotifications({
        //    annotationId: this.props.annotation.id
        //});
    }
}

const marginTop = 22;
const likeTouchableWidth = 44;
const marginRight = 20;

let styles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
        transform: [
            {rotateZ: '180deg'}
        ]
        //borderColor: 'green',
        //borderWidth: 1
    },
    row: {
        flexDirection: 'row',
        marginTop: 22,
        marginRight: marginRight
        //height: 80
    },
    likeTouchable: {
        //width: likeTouchableWidth,
        overflow: 'hidden',
        paddingLeft: 12,
        paddingRight: 12,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'orange'
    },
    icon: {
        backgroundColor: 'transparent'
    },
    card: {
        // uncomment to fix heart positioning
        //height: 80,
        flex: 1,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: colors.white,
        overflow: 'hidden',
        borderRadius: 5,
    },
    image: {
        width: 40,
        backgroundColor: colors.lightGrey,
        position: 'relative'
    },
    tint: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        opacity: tintOpacity
    },
    text: {
        padding: 10,
        paddingTop: 6,
        fontFamily: 'System',
        fontSize: 16,
        lineHeight: 22,
        color: colors.darkGrey,
        flex: 1,

    }
});

const contained = NavigationExperimental.Container.create(ScrollableAnnotationItem);

export default Relay.createContainer(contained, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                text
                viewerHasLiked
                ${LikeAnnotationMutation.getFragment('annotation')}
                user {
                    id
                    facebookId
                    displayName
                }
            }
        `
    }
});