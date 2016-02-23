import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Tabs from './Tabs/Tabs';
import PodcastInfo from './PodcastInfo/PodcastInfoRoot';
import Player from './Player/PlayerRoot';

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