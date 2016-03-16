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
            <View style={styles.wrapper}>
                <CommentButton onPress={this.props.onCommentPress}/>
                <EmojiButton />
                <ShareMomentButton />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        paddingBottom: 35,
        paddingTop: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});