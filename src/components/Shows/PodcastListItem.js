import React, {
    ActionSheetIOS,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Relay from 'react-relay';
import TouchableFade from '../common/TouchableFade';
import colors from '../../colors';
import {PrimaryText, SecondaryText} from '../../type';
import PodcastActionSheet from '../common/PodcastActionSheet';

import store from '../../redux/create';
import {showPodcastInfo} from '../../redux/modules/podcastInfo';

class PodcastListItem extends Component {

    state = {
        actionSheetVisible: false
    };

    showPodcastInfo() {
        store.dispatch(showPodcastInfo(this.props.podcast.id))
    }

    renderDots() {
        return (
            <TouchableOpacity style={styles.touchable}>
                <Image style={styles.dots} source={require('image!dots')} />
            </TouchableOpacity>
        )
    }

    hasNewEpisode() {
        return (this.props.podcast.latestEpisode && !this.props.podcast.latestEpisode.viewerHasHeard)
    }

    renderSecondary() {
        //console.info('latest episode: ', this.props.podcast.latestEpisode);
        return this.hasNewEpisode() ?
            <SecondaryText style={[styles.secondary, styles.newText]}>New Episode!</SecondaryText> :
            <SecondaryText style={styles.secondary}>You're all caught up.</SecondaryText>;
    }

    render() {
        return (
            <TouchableFade style={styles.wrapper}
                           underlayColor={colors.darkerGrey}
                           onPress={this.showPodcastInfo.bind(this)}
                           onLongPress={() => this.setState({actionSheetVisible: true})}
            >
                <Image
                    style={styles.artwork}
                    source={{uri: this.props.podcast.artwork}} />

                {this.hasNewEpisode() && <View style={styles.newEpisodeBar} />}

                <View style={styles.info}>
                    <PrimaryText style={styles.name} numberOfLines={1}>{this.props.podcast.name}</PrimaryText>
                    {this.renderSecondary()}
                </View>
                <PodcastActionSheet
                    podcast={this.props.podcast}
                    visible={this.state.actionSheetVisible}
                    onComplete={() => this.setState({actionSheetVisible: false})}
                />
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
        paddingBottom: 12,
        position: 'relative'
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
    },
    secondary: {
        marginTop: 6
    },
    newText: {
        color: colors.attention,
        fontWeight: '500'
    },
    newEpisodeBar: {
        backgroundColor: colors.attention,
        position: 'absolute',
        width: 4,
        left: 0,
        top: 12,
        height: 66
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
                latestEpisode {
                    viewerHasHeard
                    title
                }
                ${PodcastActionSheet.getFragment('podcast')}
            }
        `
    }
})