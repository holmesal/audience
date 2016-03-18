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

    componentWillReceiveProps(nextProps) {
        console.info('update!', this.props);
        if (nextProps.sendingComment) {
            this.fadeOutAndIn()
        }
    }

    fadeOutAndIn() {
        Animated.timing(this.state.opacity, {
            toValue: 0.3,
            duration: 0.3
        }).start(() => {
            if (!this.props.sendingComment) {
                Animated.spring(this.state.opacity, {
                    toValue: 1
                }).start()
            } else {
                Animated.spring(this.state.opacity, {
                    toValue: 0.5,
                    duration: 0.3
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

//export default connect(commentButton$)(CommentButton);

export default CommentButton;