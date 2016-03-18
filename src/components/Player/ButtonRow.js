import React, {
    Animated,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import CommentButton from './CommentButton';
import EmojiButton from './EmojiButton';
import ShareMomentButton from './ShareMomentButton';

export default class ButtonRow extends Component {

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
        console.info('button row is rendering!');
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
                <ShareMomentButton />
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