import React, {
    Component,
    Dimensions,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import DebugView from '../common/DebugView';
import colors from '../../colors';
import GrabHandle from './GrabHandle';
import SelectedSegment from './SelectedSegment';

const {width} = Dimensions.get('window');

const sidePadding = 60;
const handleWidth = 100;

export default class Highlight extends Component {

    state = {
        velocityStart: 0,
        velocityEnd: 0,
        loopMode: 'full'
    };

    render() {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <View style={styles.wrapper}>
                    <SelectedSegment style={styles.highlighted}
                                     loopMode={this.state.loopMode}
                                     duration={5000}
                                     edgeLoopAmount={1000}
                    />
                    <GrabHandle style={[styles.handle, {left: sidePadding - handleWidth/2}]}
                                maxDisplacement={sidePadding}
                                onVelocityChange={velocityStart => this.setState({velocityStart})}
                                onGrab={() => this.setState({loopMode: 'start'})}
                                onRelease={() => this.setState({loopMode: 'full'})}
                    />
                    <GrabHandle style={[styles.handle, {right: sidePadding - handleWidth/2}]}
                                maxDisplacement={sidePadding}
                                onVelocityChange={velocityEnd => this.setState({velocityEnd})}
                                onGrab={() => this.setState({loopMode: 'end'})}
                                onRelease={() => this.setState({loopMode: 'full'})}
                    />
                </View>
                <Text style={styles.speedo}>VelocityStart: {this.state.velocityStart}</Text>
                <Text style={styles.speedo}>VelocityEnd: {this.state.velocityEnd}</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        height: 200,
        alignSelf: 'stretch',
        backgroundColor: colors.white,
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative'
    },
    highlighted: {
        alignSelf: 'stretch',
        flex: 1,
        marginLeft: sidePadding,
        marginRight: sidePadding
    },
    handle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: handleWidth,
        opacity: 0.5
    },
    speedo: {
        color: colors.white
    }
});