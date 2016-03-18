import React, {
    Component,
    Image,
    ListView,
    PanResponder,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import ScrollableAnnotationItem from './ScrollableAnnotationItem';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

export default class ScrollableAnnotationView extends Component {

    componentWillMount() {
        // Create a pan responder for the scroll view
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {},
            onPanResponderMove: (ev, gestureState) => {},
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                this.startResetTimer();
            },
            onPanResponderTerminate: (evt, gestureState) => {},
            onShouldBlockNativeResponder: (evt, gestureState) => true
        });
    }


    componentDidUpdate(prevProps, prevState) {

    }

    startResetTimer() {
        console.info('starting scroll reset timer')
        clearTimeout(this._scrollResetTimer);
        this._scrollResetTimer = setTimeout(() => {
            this.scrollToBottom();
        }, 5000)
    }

    scrollToBottom() {
        console.info('scrolling to bottom!');
        this.refs.scrollView.scrollTo({y: 0});
    }

    renderRows() {
        return this.props.annotations.map((annotation) => <ScrollableAnnotationItem key={annotation.id} annotation={annotation} />);
    }

    render() {
        //console.info(this.props.annotations)
        return (
            <ScrollView
                ref="scrollView"
                style={styles.container}
                stickyHeaderIndices={[0]}
                scrollEventThrottle={100}
                {...this._panResponder.panHandlers}
            >
                <View />
                {this.renderRows()}
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        transform: [
            {rotateZ: '180deg'}
        ]
    }
});