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

export default class CommentButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
            >
                <Image style={styles.buttonImage} source={require('image!buttonComment')} />
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