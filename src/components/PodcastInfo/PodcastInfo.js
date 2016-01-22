import React, {
    Animated,
    Component,
    Image,
    Text,
    View
} from 'react-native';

import {connect} from 'react-redux/native';
import {podcastInfo$} from '../../redux/modules/podcastInfo';

class PodcastInfo extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        opacity: new Animated.Value(0)
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.visible) {
            Animated.timing(this.state.opacity, {
                toValue: 1
            }).start();
        }
    }

    renderLoading() {
        return <View><Text>Loading...</Text></View>
    }

    renderPodcastInfo() {
        console.info('podcast info props', this.props);
        return <View><Text>{JSON.stringify(this.props.podcast)}</Text></View>
    }

    render() {
        let view = this.props.visible ? this.renderPodcastInfo() : this.renderLoading();
        return (
            <Animated.View style={[style.wrapper, {opacity: this.state.opacity}]}>
                {view}
            </Animated.View>
        );
    }
}

let style = {
    wrapper: {
        position: 'absolute',
        top: 300,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'red',
        opacity: 0.5,
        paddingTop: 20,
        paddingBottom: 0 // TODO - replace with tab bar padding
    }
};

export default connect(podcastInfo$)(PodcastInfo);