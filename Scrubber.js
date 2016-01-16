import React, {
    Animated,
    Component,
    ScrollView,
    Text,
    View
} from 'react-native';

export default class Scrubber extends Component {

    state = {
        scrollX: new Animated.Value(0)
    };

    renderTestElement() {
        return (
            <Animated.View style={[style.testWrapper, {transform: [{translateX: this.state.scrollX}]}]}>
                <Text>I am the test element</Text>
            </Animated.View>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView horizontal
                            scrollEventThrottle={16}
                            style={style.wrapper}
                            contentContainerStyle={style.scrollContent}
                            onScroll={Animated.event([{nativeEvent: {contentOffset: {x: this.state.scrollX}}}])}
                >
                    <Text style={{marginTop: 100}}>I am the Scrubber component! and this is some longs gha foashdfa ;sfh; sjk fl fs fad; las;fks fgkajsfg ;asdfgk</Text>
                </ScrollView>
                {this.renderTestElement()}
            </View>
        );
    }
}

let style = {
    wrapper: {
        flex: 1,
        backgroundColor: 'red'
    },
    scrollContent: {
        backgroundColor: 'green',
        width: 1000
    },

    testWrapper: {
        width: 150,
        height: 150,
        backgroundColor: 'orange',
        position: 'absolute',
        top: 300,
        left: 100
    }
};