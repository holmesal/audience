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
import CompactPlayer from '../CompactPlayer/CompactPlayerRoot';

export default class Authenticated extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                {/** Flex-positioned views */}
                <Tabs />
                <CompactPlayer />

                {/** Overlay views */}
                <PodcastInfoWrapper />
                <Player />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});