import React, {
    Animated,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import PhotoHeader from './PhotoHeader';
import TopBar from './TopBar';
import colors from '../../colors';

import {connect} from 'react-redux/native';
import {podcastInfo$, hidePodcastInfo, showPodcastInfo} from '../../redux/modules/podcastInfo';

class PodcastInfo extends Component {

    static propTypes = {};

    static defaultProps = {
        podcast: {
            artworkUrl600: 'http://is2.mzstatic.com/image/thumb/Music4/v4/c0/bb/52/c0bb5293-0e74-3bf7-6a2d-e8e18e8d80e4/source/600x600bb.jpg',
            collectionName: 'Welcome to Night Vale'
        },
        visible: false
    };

    state = {
        opacity: new Animated.Value(0)
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
                toValue: 1
            }).start();
        }
    }

    renderPodcastInfo() {
        console.info('podcast info props', this.props);
        return (
            <View>
                <PhotoHeader
                    title={this.props.podcast.collectionName}
                    photoUrl={this.props.podcast.artworkUrl600}
                />
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
        if (!this.props.visible) return <View />;

        // If visible, show loading until podcast is loaded
        let view = this.props.podcast ? this.renderPodcastInfo() : this.renderLoading();
        return (
            <Animated.View style={[styles.wrapper, {opacity: this.state.opacity}]}>
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
    }
});

export default connect(podcastInfo$)(PodcastInfo);