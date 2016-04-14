import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Tabs from './../Tabs/Tabs';
import PodcastInfoWrapper from './../PodcastInfo/PodcastInfoWrapper';
import Player from './../Player/PlayerRoot';
import PlayerWrapper from './../Player/PlayerWrapper';
import CompactPlayer from '../CompactPlayer/CompactPlayerRoot';
import ClipPlayer from '../Audio/ClipPlayer';
//import MiniPlayer from '../Player/MiniPlayer';

// Testing
import AnnotationRoot from '../Annotation/AnnotationRoot';
import RootStack from '../Nav/RootStack';

export default class Authenticated extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <RootStack />
                <PlayerWrapper />
                <CompactPlayer />

                <ClipPlayer />
            </View>
        )
        //return (
        //    <View style={styles.wrapper}>
        //        {/** Flex-positioned views */}
        //        <Tabs />
        //        <CompactPlayer />
        //
        //        {/** Overlay views */}
        //        <PodcastInfoWrapper />
        //        <Player />
        //    </View>
        //);
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'red'
    }
});