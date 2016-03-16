import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../colors';
import {pause, resume, controls$} from '../../redux/modules/player.js';
import {connect} from 'react-redux';

class PlayPauseButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    handlePress() {
        if (this.props.playing) this.props.dispatch(pause());
        else this.props.dispatch(resume());
    }

    render() {
        let iconName = this.props.playing ? 'pause' : 'play';

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.wrapper, this.props.style]}
                onPress={this.handlePress.bind(this)}
            >
                <Icon name={iconName} size={38} color={colors.lighterGrey} />
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //backgroundColor: 'red',
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 80
    }
});

export default connect(controls$)(PlayPauseButton);