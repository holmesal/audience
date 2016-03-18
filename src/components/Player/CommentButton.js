import React, {
    Animated,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import colors from '../../colors';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import {sendingComment$, commentButton$} from '../../redux/modules/player';

class CommentButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        opacity: new Animated.Value(1)
    };

    componentDidUpdate(prevProps, prevState) {
        console.info('update!', this.props);
        if (this.props.sendingComment && this.props.sendingComment != prevProps.sendingComment) {
            this.fadeOutAndIn()
        }
    }

    fadeOutAndIn() {
        Animated.timing(this.state.opacity, {
            toValue: 0.3
        }).start(() => {
            if (!this.props.sendingComment) {
                Animated.spring(this.state.opacity, {
                    toValue: 1
                }).start()
            } else {
                Animated.timing(this.state.opacity, {
                    toValue: 0.5
                }).start((s) => {
                    this.fadeOutAndIn();
                })
            }
        })
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
            >
                <Animated.Image
                    style={[styles.buttonImage, {
                        opacity: this.state.opacity
                    }]}
                    source={require('image!buttonComment')}
                />
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

export default connect(commentButton$)(CommentButton);