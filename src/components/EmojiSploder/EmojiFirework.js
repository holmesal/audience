import React, {
    Animated,
    Component,
    Easing,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Emoji from 'react-native-emoji';

export default class EmojiFirework extends Component {

    static propTypes = {
        name: PropTypes.string
    };

    static defaultProps = {

    };

    state = {
        scale: new Animated.Value(0.3),
        pan: new Animated.ValueXY()
    }

    componentDidMount() {
        this.fly()
    }

    fly() {
        Animated.spring(this.state.pan, {
            toValue: {
                x: 80,
                y: -400
            },
            velocity: 30,
            tension: -10,
            friction: 8
        //Animated.timing(this.state.pan, {
        //    toValue: {
        //        x: 80,
        //        y: -400
        //    },
        //    duration: 800,
        //    easing: Easing.out(Easing.ease)
        }).start(() => {
            setTimeout(() => {
                this.state.pan.setValue({x: 0, y: 0});
                this.fly();
            }, 1000)
        })
    }


    render() {
        return (
            <Animated.View style={[styles.wrapper, {transform: [{scale: 0.3}, {rotateZ: '12deg'}]}, this.state.pan.getLayout()]}>
                <Text style={styles.emoji}><Emoji name={this.props.name} /></Text>
                <View style={styles.contrails}>
                    <View style={styles.contrail} />
                    <View style={[styles.contrail, {marginTop: 20}]} />
                    <View style={styles.contrail} />
                </View>
            </Animated.View>
        );
    }
}

const emojiSize = 60;

let styles = StyleSheet.create({
    wrapper: {
        //marginTop: -400,
        marginBottom: -60,
        backgroundColor: 'transparent',
        //backgroundColor: 'red',
        width: emojiSize,

    },
    emoji: {
        fontSize: emojiSize,
        marginBottom: 0
    },
    contrails: {
        alignSelf: 'stretch',
        //backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    contrail: {
        width: 2,
        height: 50,
        backgroundColor: '#979797'
    }
});