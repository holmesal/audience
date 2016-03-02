import React, {
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

import store from '../../redux/create';
import {showPodcastInfo} from '../../redux/modules/podcastInfo';

class PodcastListItem extends Component {

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

    renderSecondary() {
        let text = 'You\'re all caught up.';
        return <SecondaryText>{text}</SecondaryText>;
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
                    <PrimaryText style={styles.name} numberOfLines={1}>{this.props.podcast.name}</PrimaryText>
                    {this.renderSecondary()}
                </View>
                {this.renderDots()}
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
        //justifyContent: 'center',
        alignSelf: 'stretch',
        height: 66
    },
    text: {
        fontFamily: 'System'
    },
    name: {
        marginBottom: 6
    },
    secondary: {
        fontSize: 14,
        color: colors.grey,
        letterSpacing: 0.79,
        fontWeight: '200'
    },
    touchable: {
        //backgroundColor: 'red',
        width: 48,
        height: 48,
        position: 'absolute',
        top: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dots: {
        tintColor: '#A4A4A4'
    },
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