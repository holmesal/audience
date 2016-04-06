import React, {
    Animated,
    Component,
    Dimensions,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {connect} from 'react-redux';
import {visible$} from '../../redux/modules/player.js';
import {createSelector} from 'reselect';
import PlayerRoot from './PlayerRoot';
import colors from '../../colors';

const OFFSCREEN = Dimensions.get('window').height;

class PlayerWrapper extends Component {

    constructor(props) {
        super(props);
        const visibility = new Animated.Value(0);
        const offset = visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [OFFSCREEN, 0]
        });
        this.state = {
            visibility,
            offset
        };
    }

    //state = {
    //    //opacity: new Animated.Value(1),
    //    //offset: new Animated.Value(0)
    //};

    componentDidMount() {
        this.updateVisibility();
    }

    componentDidUpdate(prevProps, prevState) {
        this.updateVisibility();
    }

    updateVisibility() {
        console.info('updating visibility: ', this.props.visible)
        if (this.props.visible) {
            Animated.spring(this.state.visibility, {
                toValue: 1,
                tension: 32,
                friction: 8
            }).start();
        } else {
            Animated.spring(this.state.visibility, {
                toValue: 0,
                tension: 31,
                friction: 9
            }).start();
        }
    }

    render() {
        let pointerEvents = this.props.visible ? 'auto' : 'none';
        return (
            <Animated.View
                ref="wrapper"
                style={[styles.wrapper, {transform: [{translateY: this.state.offset}]}]}
                pointerEvents={pointerEvents}
            >
                <PlayerRoot />
            </Animated.View>
        );
    }
}

const overflowBottom = 100;
let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.darkGrey,
        opacity: 1,
        position: 'absolute',
        top: 0,
        bottom: -overflowBottom,
        left: 0,
        right: 0,
        paddingBottom: 44 + overflowBottom
    }
});

const sel$ = createSelector(visible$, visible => ({visible}));

export default connect(sel$)(PlayerWrapper);