import React, {
    ActivityIndicatorIOS,
    Component,
    Dimensions,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import TouchableFade from '../common/TouchableFade';
import Icon from 'react-native-vector-icons/Ionicons';
import {pause, resume, controls$} from '../../redux/modules/player.js';
import {connect} from 'react-redux';

class Controls extends Component {

    static propTypes = {
        onSkip: React.PropTypes.func.isRequired
    };

    static defaultProps = {};

    handleCenterPress() {
        if (this.props.playing) this.props.dispatch(pause());
        else this.props.dispatch(resume())
    }

    renderCenterButtonContent() {
        console.info('is playing?', this.props.playing)
        let icon = this.props.playing ? 'ios-pause' : 'ios-play';
        return (
            <Icon name={icon} size={44} color={'rgba(238,238,238, 0.7)'} />
        );
        //if (this.props.playing) {
        //} else if (this.props.buffering) {
        //    return (
        //        <ActivityIndicatorIOS />
        //    )
        //}
    }

    render() {
        let activeOpacity = 0.8;
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity activeOpacity={activeOpacity} style={[styles.button, styles.side]} onPress={() => this.props.onSkip(-15)}><Image source={require('image!skipBack15')}/></TouchableOpacity>
                <TouchableOpacity activeOpacity={activeOpacity} style={[styles.button, styles.center]} onPress={this.handleCenterPress.bind(this)}>{this.renderCenterButtonContent()}</TouchableOpacity>
                <TouchableOpacity activeOpacity={activeOpacity} style={[styles.button, styles.side]} onPress={() => this.props.onSkip(15)}><Image source={require('image!skipForward15')}/></TouchableOpacity>
            </View>
        );
    }
}

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: 'absolute',
        top: windowHeight / 2 + 36,
        left: 0,
        right: 0,
        height: 66,
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    side: {
        width: 40 + 16 + 16
    },
    center: {
        flex: 1
    }
});

export default connect(controls$)(Controls);