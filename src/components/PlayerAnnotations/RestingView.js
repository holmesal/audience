import React, {
    Animated,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import colors from '../../colors';

export default class RestingView extends Component {

    static propTypes = {
        visible: PropTypes.bool
    };

    static defaultProps = {
        visible: true
    };

    state = {
        opacity: new Animated.Value(0)
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) this.show();
        else this.hide()
    }

    show() {
        Animated.spring(this.state.opacity, {
            toValue: 1
        }).start()
    }

    hide() {
        Animated.spring(this.state.opacity, {
            toValue: 0
        }).start()
    }

    render() {
        return (
            <Animated.View style={[styles.wrapper, {opacity: this.state.opacity}]}>
                <Text style={styles.header}>You are listening with:</Text>
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 20,
        paddingTop: 54
    },
    header: {
        fontFamily: 'System',
        fontWeight: '200',
        color: colors.lighterGrey,
        fontSize: 24
    }
});