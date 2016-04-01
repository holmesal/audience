import React, {
    Animated,
    Component,
    DeviceEventEmitter,
    Image,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import CompactAnnotation from './CompactAnnotation';
import Replies from './Replies';
import Compose from './Compose';

class AnnotationView extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        keyboardHeight: new Animated.Value(0)
    };

    componentWillMount() {
        this._keyboardShowListener = DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        this._keyboardHideListener = DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    }

    componentWillUnmount() {
        this._keyboardShowListener.remove();
        this._keyboardHideListener.remove();
    }

    keyboardWillShow(ev) {
        Animated.spring(this.state.keyboardHeight, {
            toValue: -ev.endCoordinates.height,
            tension: 60,
            friction: 12
        }).start();
    }

    keyboardWillHide(ev) {
        Animated.spring(this.state.keyboardHeight, {
            toValue: 0,
            tension: 60,
            friction: 10
        }).start();
    }

    render() {
        console.info(this.props);
        return (
            <Animated.View style={[styles.wrapper, {transform: [{translateY: this.state.keyboardHeight}]}]}>
                <ScrollView style={styles.scroll}
                            stickyHeaderIndices={[]}
                            contentContainerStyle={styles.scrollContent}>
                    <CompactAnnotation annotation={this.props.annotation} />
                    <Replies annotation={this.props.annotation} />
                </ScrollView>
                <Compose annotation={this.props.annotation} />
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    scroll: {
        flex: 1
    },
    scrollContent: {
        paddingTop: 100
    }
});

export default Relay.createContainer(AnnotationView, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                text
                ${CompactAnnotation.getFragment('annotation')}
                ${Replies.getFragment('annotation')}
                ${Compose.getFragment('annotation')}
                clip {
                    id
                }
            }
        `
    }
});