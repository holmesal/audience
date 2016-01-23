import React, {
    Animated,
    Component,
    Dimensions,
    Image,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import PhotoHeader from './PhotoHeader';
import TopBar from './TopBar';
import colors from '../../colors';
import EpisodeList from './EpisodeList';

import {connect} from 'react-redux/native';
import {podcastInfo$, hidePodcastInfo, showPodcastInfo} from '../../redux/modules/podcastInfo';

const OFFSCREEN = Dimensions.get('window').height + 50;

class PodcastInfo extends Component {

    static propTypes = {};

    static defaultProps = {
        //podcast: {
        //    artworkUrl600: 'http://is2.mzstatic.com/image/thumb/Music4/v4/c0/bb/52/c0bb5293-0e74-3bf7-6a2d-e8e18e8d80e4/source/600x600bb.jpg',
        //    collectionName: 'Welcome to Night Vale'
        //},
        //visible: false
    };

    state = {
        opacity: new Animated.Value(0),
        offset: new Animated.Value(OFFSCREEN)
    };

    componentDidMount() {
        setTimeout(() => {
            this.props.dispatch(showPodcastInfo('536258179'));
        }, 300);
    }

    componentDidUpdate(prevProps, prevState) {
        this.updateVisibility();
    }

    updateVisibility() {
        if (this.props.visible) {
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 200
            }).start();
            Animated.spring(this.state.offset, {
                toValue: 0,
                tension: 32,
                friction: 8
            }).start();
        } else {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 500
            }).start();
            Animated.spring(this.state.offset, {
                toValue: OFFSCREEN,
                tension: 31,
                friction: 9
            }).start();
        }
    }

    renderPodcastInfo() {
        console.info('podcast info props', this.props);
        return (
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <PhotoHeader
                        title={this.props.podcast.collectionName}
                        photoUrl={this.props.podcast.artworkUrl600}
                    />
                    <EpisodeList />
                </ScrollView>
                <TopBar
                    onBackPress={() => this.props.dispatch(hidePodcastInfo())}
                />
            </View>
        )
    }

    renderLoading() {
        return <View><Text>Loading...</Text></View>
    }

    render() {
        // If not visible, show nothing
        //if (!this.props.visible) return <View />;

        // If visible, show loading until podcast is loaded
        let view = this.props.podcast ? this.renderPodcastInfo() : this.renderLoading();
        //let view = this.renderPodcastInfo();
        let pointerEvents = this.props.visible ? 'auto' : 'none';
        return (
            <Animated.View style={[styles.wrapper, {opacity: this.state.opacity, transform: [{translateY: this.state.offset}]}]} pointerEvents={pointerEvents}>
                {view}
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.darkGrey,
        opacity: 1,
        paddingBottom: 0 // TODO - replace with tab bar padding
    },
    scrollContent: {
        //paddingTop: 70
    }
});

export default connect(podcastInfo$)(PodcastInfo);