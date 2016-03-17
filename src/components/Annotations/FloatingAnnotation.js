import React, {
    Animated,
    Component,
    Dimensions,
    Easing,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import colors from '../../colors';

const speed = 20; // pixels per second
const dieTarget = -300;
const lifespan = Math.abs(dieTarget / speed) * 1000;

export default class FloatingAnnotation extends Component {

    static propTypes = {};

    static defaultProps = {
        onDie: () => console.warn('you should implement onDie()')
    };

    state = {
        top: new Animated.Value(60),
        opacity: new Animated.Value(0),
        offset: new Animated.Value(0)
    };

    componentDidMount() {
        // First fade it in
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 300
        }).start(() => {
            // Then start fading it out
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: lifespan,
                easing: Easing.inOut(Easing.linear)
            }).start();
        });

        Animated.spring(this.state.top, {
            toValue: 0,
            tension: 80,
            friction: 12
        }).start(() => {
            Animated.timing(this.state.top, {
                toValue: dieTarget,
                duration: lifespan,
                easing: Easing.inOut(Easing.linear)
            }).start(() => {
                //console.info('killing!');
                this.props.onDie();
            });
        })

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.offset != prevProps.offset) {
            //console.info('new offset!', this.props.offset);
            Animated.spring(this.state.offset, {
                toValue: -this.props.offset
            }).start();
        }
    }

    handleLayout(ev) {
        this.setState({
            height: ev.nativeEvent.layout.height
        });
        this.props.onLayout(ev.nativeEvent.layout);
    }

    render() {
        const hardcodedHeight = 40;
        const photoUrl = `http://graph.facebook.com/v2.5/${this.props.annotation.user.facebookId}/picture?type=square&height=${hardcodedHeight}`;
        return (
            <Animated.View
                style={[styles.wrapper, {
                    opacity: this.state.opacity,
                    marginBottom: this.state.offset,
                    transform: [
                        {translateY: this.state.top},
                        {translateY: this.state.offset}
                    ]
                }]}
            >
                <View style={styles.contentContainer} onLayout={this.handleLayout.bind(this)}>
                    <Image
                        source={{uri: photoUrl}}
                        style={[styles.image, {height: this.state.height || 0}]}
                    />
                    <Text style={styles.text}>{this.props.annotation.text}</Text>
                </View>
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 130,
        left: 20,
        right: 20,
        //backgroundColor: 'red',
    },
    contentContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        overflow: 'hidden',
        borderRadius: 5,
    },
    image: {
        width: 40,
        backgroundColor: colors.lightGrey,
    },
    text: {
        flex: 1,
        alignSelf: 'stretch',
        padding: 10,
        fontSize: 16,
        lineHeight: 22,
        color: colors.darkGrey,
        //backgroundColor: 'green'
    }
});

export default Relay.createContainer(FloatingAnnotation, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                text
                time
                user {
                    displayName
                    facebookId
                }
            }
        `
    }
});