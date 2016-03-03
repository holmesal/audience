import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {prettyFormatTime} from '../../utils'
import {SecondaryText} from '../../type';

export default class TimeRemaining extends Component {

    static propTypes = {
        time: React.PropTypes.number.isRequired,
        duration: React.PropTypes.number.isRequired
    };

    static defaultProps = {};

    render() {
        let remainingSeconds = Math.floor(this.props.duration - this.props.time);

        return (
            <SecondaryText style={[styles.text, this.props.style]}>-{prettyFormatTime(remainingSeconds)}</SecondaryText>
        );
    }
}

let styles = StyleSheet.create({
    text: {
        backgroundColor: 'transparent'
    }
});