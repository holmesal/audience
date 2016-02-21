import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Tabs from './Tabs';
import PodcastInfo from './PodcastInfo/PodcastInfo';
import Player from './Player/Player';

export default class Authenticated extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <Tabs />
                <PodcastInfo />
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