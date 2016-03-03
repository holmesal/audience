import React, {
    Animated,
    Component,
    Dimensions,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Relay from 'react-relay';

import {PrimaryText, SecondaryText} from '../../type';

class Info extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        opacity: new Animated.Value(1)
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.visible) {
            Animated.spring(this.state.opacity, {
                toValue: 1
            }).start()
        } else {
            Animated.timing(this.state.opacity, {
                toValue: 0.1,
                duration: 150
            }).start()
        }
    }

    render() {
        return (
            <Animated.View style={[styles.wrapper, {opacity: this.state.opacity}]} pointerEvents="none">
                <PrimaryText style={[styles.text, {marginBottom: 24}]}>{this.props.episode.title}</PrimaryText>
                <TouchableOpacity>
                    <SecondaryText style={styles.text}>{this.props.episode.podcast.name}</SecondaryText>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

let windowHeight = Dimensions.get('window').height;

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        left:0,
        right:0,
        height: 0.4 * windowHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    text: {
        textAlign: 'center'
    }
});

export default Relay.createContainer(Info, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                title
                podcast {
                    name
                }
            }
        `
    }
});