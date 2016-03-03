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

let windowWidth = Dimensions.get('window').width;

export default class ProgressBar extends Component {

    static propTypes = {
        progress: React.PropTypes.number.isRequired
    };

    static defaultProps = {
        progress: 0
    };

    state = {
        width: new Animated.Value(0)
    };

    componentDidMount() {
        this.updateWidth();
    }


    componentDidUpdate(prevProps, prevState) {
        if (this.props.progress != prevProps.progress) this.updateWidth();
    }

    updateWidth() {
        let target = (this.props.progress * windowWidth) || 0;
        Animated.spring(this.state.width, {
            toValue: target
        }).start()
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <Animated.View style={[styles.progress, {width: this.state.width}]} />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        height: 2,
        backgroundColor: 'rgba(254,254,254,0.15)'
    },
    progress: {
        backgroundColor: 'rgba(254,254,254,0.68)',
        flex: 1,
        width: 0
    }
});