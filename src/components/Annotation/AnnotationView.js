import React, {
    Animated,
    Component,
    DeviceEventEmitter,
    Image,
    NavigationExperimental,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Relay from 'react-relay';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../colors';
import CompactAnnotation from './CompactAnnotation';
import CommentList from './CommentList';
import Compose from './Compose';

const {
    Container: NavigationContainer
} = NavigationExperimental;

class AnnotationView extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        keyboardHeight: new Animated.Value(0),
        contentSize: 0
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

    scrollToBottom() {
        this.refs.scrollView.scrollTo({y: this.state.contentSize});
    }

    goBack() {
        this.props.onNavigate({
            type: 'BackAction'
        });
        //this.props.onNavigate({
        //    type: 'NestedBack'
        //});
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <Animated.View style={[styles.wrapper, {transform: [{translateY: this.state.keyboardHeight}]}]}>
                    <ScrollView style={styles.scroll}
                                ref="scrollView"
                                stickyHeaderIndices={[]}
                                onContentSizeChange={contentSize => this.setState({contentSize})}
                                contentContainerStyle={styles.scrollContent}>
                        <CompactAnnotation annotation={this.props.annotation} />
                        <CommentList annotation={this.props.annotation} />
                    </ScrollView>
                    <Compose annotation={this.props.annotation}
                             onComment={this.scrollToBottom.bind(this)}
                             autoFocus={this.props.focusInput}
                    />
                </Animated.View>
                <TouchableOpacity style={styles.backButton}
                                  onPress={this.goBack.bind(this)}
                                  activeOpacity={0.8}>
                    <Icon name="ios-arrow-left" color={colors.lightGrey} size={32} />
                </TouchableOpacity>
            </View>
        );
    }
}

//const paddingTop = 100;
let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    scroll: {
        flex: 1,
        //marginTop: 100
    },
    scrollContent: {
        //paddingTop
    },
    backButton: {
        height: 60,
        width: 60,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const contained = NavigationContainer.create(AnnotationView);

export default Relay.createContainer(contained, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                text
                ${CompactAnnotation.getFragment('annotation')}
                ${CommentList.getFragment('annotation')}
                ${Compose.getFragment('annotation')}
                clip {
                    id
                }
            }
        `
    }
});