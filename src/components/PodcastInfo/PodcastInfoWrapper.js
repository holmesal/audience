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
import Relay from 'react-relay';
import colors from '../../colors';
import PodcastInfoRoot from './PodcastInfoRoot';
import TopBar from './TopBar';

import {connect} from 'react-redux';
import {podcastInfo$, hidePodcastInfo} from '../../redux/modules/podcastInfo';

const OFFSCREEN = Dimensions.get('window').height + 50;

export default class PodcastInfoWrapper extends Component {

    static propTypes = {};

    static defaultProps = {
        doneAnimating: false
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
        this.updateVisibility();
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
            }).start(() => {
                if (!this.state.doneAnimating) this.setState({doneAnimating: true})
            });
        } else {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 500
            }).start();
            Animated.spring(this.state.offset, {
                toValue: OFFSCREEN,
                tension: 31,
                friction: 9
            }).start((end) => {
                if (end.finished && this.state.doneAnimating) this.setState({doneAnimating: false})
            });
        }
    }

    render() {
        //console.info('podcast info props', this.props);
        // If not visible, show nothing
        //if (!this.props.visible) return <View />;

        // If visible, show loading until podcast is loaded
        //let view = this.props.podcast ? this.renderPodcastInfo() : this.renderLoading();
        let pointerEvents = this.props.visible ? 'auto' : 'none';
        return (
            <Animated.View style={[styles.wrapper, {opacity: this.state.opacity, transform: [{translateY: this.state.offset}]}]} pointerEvents={pointerEvents}>
                <PodcastInfoRoot />
                <TopBar
                    onBackPress={() => this.props.dispatch(hidePodcastInfo())}
                />
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

export default connect(podcastInfo$)(PodcastInfoWrapper);