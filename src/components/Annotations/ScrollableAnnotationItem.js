import React, {
    Animated,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class ScrollableAnnotationItem extends Component {

    state = {
        height: new Animated.Value(0),
        laidOut: false
    };

    componentDidMount() {
        console.info('mount!!!')
    }


    handleLayout(ev) {
        let height = ev.nativeEvent.layout.height;
        Animated.spring(this.state.height, {
            toValue: height
        }).start()
    }

    render() {
        return (
            <Animated.View style={[styles.wraper, {
                height: this.state.height
            }]}>
                <View style={styles.row} onLayout={this.handleLayout.bind(this)}>
                    <Text style={styles.text}>{this.props.annotation.text}</Text>
                </View>
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden'
    },
    row: {
        height: 80,
        borderWidth: 1,
        borderColor: 'red'
    },
    text: {
        color: '#fefefe'
    }
});