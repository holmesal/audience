import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import TouchableFade from '../common/TouchableFade';
import colors from '../../colors';

import store from '../../redux/create';
import {showPodcastInfo} from '../../redux/modules/podcastInfo';

class PodcastListItem extends Component {

    showPodcastInfo() {
        store.dispatch(showPodcastInfo(this.props.podcast.id))
    }

    renderSecondary() {
        let text = 'placeholder!';
        return <Text style={[styles.text, styles.secondary]}>{text}</Text>;
    }

    render() {
        return (
            <TouchableFade style={styles.wrapper}
                           underlayColor={colors.almostDarkGrey}
                           onPress={this.showPodcastInfo.bind(this)}
            >
                <Image
                    style={styles.artwork}
                    source={{uri: this.props.podcast.artwork}} />
                <View style={styles.info}>
                    <Text style={[styles.text, styles.name]}>{this.props.podcast.name}</Text>
                    {this.renderSecondary()}
                </View>
            </TouchableFade>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 12,
        paddingBottom: 12
    },
    artwork: {
        width: 66,
        height: 66,
        marginRight: 24
    },
    info: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'stretch',
        height: 66
    },
    text: {
        fontFamily: 'System'
    },
    name: {
        fontSize: 18,
        color: colors.lightGrey,
        letterSpacing: 0.9,
        marginBottom: 6
    },
    secondary: {
        fontSize: 14,
        color: colors.grey,
        letterSpacing: 0.79,
        fontWeight: '200'
    }
});

export default Relay.createContainer(PodcastListItem, {

    initialVariables: {
        size: 'medium'
    },
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
                name
                artwork(size:$size)
            }
        `
    }
})