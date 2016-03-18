import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
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
            <TouchableOpacity
                onPress={this.handlePress.bind(this)}
            >
                <Image style={styles.buttonImage} source={require('image!buttonShare')} />
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    buttonImage: {
        width: 90,
        height: 90
    }
});