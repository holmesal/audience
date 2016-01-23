import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default class TopBar extends Component {

    static propTypes = {
        onBackPress: PropTypes.func,
        onMorePress: PropTypes.func
    };

    static defaultProps = {};

    render() {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity style={[styles.button]} onPress={this.props.onBackPress}>
                    <Image source={require('image!backChevron')} style={styles.backIcon}/>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, {right: 0}]} onPress={this.props.onMorePress}>
                    <Image source={require('image!dots')} style={styles.dotsIcon}/>
                </TouchableOpacity>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: 'transparent'
    },
    button: {
        width: 80,
        height: 80,
        position: 'absolute',
        top: 0,
        paddingTop: 20,
        backgroundColor: 'transparent'
    },
    backIcon: {
        left: 16,
        top: 10
    },
    dotsIcon: {
        position: 'absolute',
        right: 16,
        top: 40
    }
});