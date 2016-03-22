import React, {
    Animated,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import CommentButton from './CommentButton';
import EmojiButton from './EmojiButton';
import RecordButton from './RecordButton';
import ShareMomentButton from './ShareMomentButton';

class ButtonRow extends Component {

    propTypes: {
      visible: React.PropTypes.bool
    };

    defaultProps = {
        visible: false
    };

    state = {
        opacity: new Animated.Value(0)
    };


    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) this.show();
        else this.hide();
    }

    show() {
        Animated.timing(this.state.opacity, {
            toValue: 1
        }).start();
    }

    hide() {
        Animated.timing(this.state.opacity, {
            toValue: 0
        }).start();
    }

    render() {
        return (
            <Animated.View style={[styles.wrapper, this.props.style, {opacity: this.state.opacity}]}>
                <CommentButton onPress={this.props.onCommentPress}/>
                <EmojiButton
                    onPressIn={this.props.onEmojiPressIn}
                />
                <RecordButton
                    episode={this.props.episode}
                />
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    }
});

export default Relay.createContainer(ButtonRow, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                ${ShareMomentButton.getFragment('episode')}
            }
        `
    }
});