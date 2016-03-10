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
        time: PropTypes.number.isRequired,
        negative: PropTypes.bool
    };

    static defaultProps = {
        time: 0,
        negative: false
    };

    render() {
        return (
            <SecondaryText style={[styles.text, this.props.style]}>
                {this.props.negative && '-'}
                {prettyFormatTime(this.props.time)}
            </SecondaryText>
        );
    }
}

let styles = StyleSheet.create({
    text: {
        backgroundColor: 'transparent'
    }
});