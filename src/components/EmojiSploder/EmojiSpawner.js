import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import EmojiFirework from './EmojiFirework'

export default class EmojiSpawner extends Component {

    static propTypes = {};

    static defaultProps = {};

    render() {
        return <View />;
        return (
            <View style={styles.wrapper}>
                <EmojiFirework name="smile" />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'
    }
});