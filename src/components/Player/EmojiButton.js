import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import CircleButton from './CircleButton';
import colors from '../../colors';

export default class EmojiButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    handlePress() {
        console.info('emoji button pressed!');
    }

    render() {
        return (
            <CircleButton
                onPress={this.handlePress.bind(this)}
            >
                <Icon
                    name="android-happy"
                    size={24}
                    color={colors.lighterGrey}
                />
            </CircleButton>
        );
    }
}

let styles = StyleSheet.create({
});