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

export default class CommentButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    render() {
        return (
            <CircleButton
                onPress={this.props.onPress}
            >
                <Icon
                    name="ios-chatbubble-outline"
                    size={32}
                    color={colors.lighterGrey}
                />
            </CircleButton>
        );
    }
}

let styles = StyleSheet.create({
});