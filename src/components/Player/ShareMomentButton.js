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

export default class ShareMomentButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    handlePress() {
        console.info('share moment button pressed!');
    }

    render() {
        return (
            <CircleButton
                onPress={this.handlePress.bind(this)}
            >
                <Icon
                    name="android-time"
                    size={24}
                    color={colors.lighterGrey}
                />
            </CircleButton>
        );
    }
}

let styles = StyleSheet.create({
});