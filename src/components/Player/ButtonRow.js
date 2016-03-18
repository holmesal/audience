import React, {
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

    render() {
        return (
            <View style={[styles.wrapper, this.props.style]}>
                <CommentButton onPress={this.props.onCommentPress}/>
                <EmojiButton
                    onPressIn={this.props.onEmojiPressIn}
                />
                <ShareMomentButton />
            </View>
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