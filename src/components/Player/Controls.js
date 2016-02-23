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

import TouchableFade from '../TouchableFade';

import {pause, resume, controls$} from '../../redux/modules/player.js';
import {connect} from 'react-redux/native';

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
        let centerImage = this.props.playing ? require('image!pause') : require('image!play');
        return (
            <Image source={centerImage}/>
        );
        //if (this.props.playing) {
        //} else if (this.props.buffering) {
        //    return (
        //        <ActivityIndicatorIOS />
        //    )
        //}
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity style={[styles.button, styles.side]} onPress={() => this.props.onSkip(-15)}><Image source={require('image!skipBack15')}/></TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.center]} onPress={this.handleCenterPress.bind(this)}>{this.renderCenterButtonContent()}</TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.side]} onPress={() => this.props.onSkip(15)}><Image source={require('image!skipForward15')}/></TouchableOpacity>
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