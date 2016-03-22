import React, {
    Animated,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import ProgressBar from './ProgressBar';
import colors from '../../colors';
import {SecondaryText} from '../../type';
import TouchableFade from '../common/TouchableFade';
import store from '../../redux/create';
import {showPlayer, currentTime$, duration$} from '../../redux/modules/player';

class CompactPlayer extends Component {

    state = {
        height: new Animated.Value(0)
    };

    componentDidMount() {
        Animated.spring(this.state.height, {
            toValue: 40
        }).start()
    }

    showPlayer() {
        store.dispatch(showPlayer());
    }

    render() {
        console.info('compact player render', this.props);
        let progress = 0;
        if (this.props.currentTime &&
            this.props.currentTime >= 0 &&
            this.props.duration &&
            this.props.duration >= 0) {
            progress = (this.props.currentTime / this.props.duration) || 0;
        }

        let image = this.props.loading ?
            <View style={styles.artwork} /> :
            <Image style={styles.artwork} source={{uri: this.props.episode.podcast.artwork}} />;

        let title = this.props.loading ? '' : this.props.episode.title;

        return (
            <Animated.View style={[styles.wrapper, {height: this.state.height}]}>
                <ProgressBar progress={progress} />
                <TouchableFade style={styles.row} underlayColor={colors.darkerGrey} onPress={this.showPlayer.bind(this)}>
                    {image}
                    <SecondaryText style={styles.title} numberOfLines={1}>{title}</SecondaryText>
                    <Image style={styles.caret} source={require('image!backChevron')} />
                </TouchableFade>
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //height: 40
    },
    row: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F0F0F'
    },
    artwork: {
        backgroundColor: colors.darkerGrey,
        alignSelf: 'stretch',
        width: 40,
        marginRight: 12
    },
    title: {
        flex: 1,
        color: '#FEFEFE',
        fontSize: 14,
        letterSpacing: 0.7,
        backgroundColor: 'transparent'
    },
    caret: {
        marginRight: 12,
        marginLeft: 12,
        backgroundColor: 'transparent',
        transform: [
            {scale: 0.5},
            {rotateZ: "90deg"}
        ]
    }
});

export const compactPlayer$ = createSelector(currentTime$, duration$, (currentTime, duration) => ({
    currentTime,
    duration
}));

let connectedCompactPlayer = connect(compactPlayer$)(CompactPlayer);

export default Relay.createContainer(connectedCompactPlayer, {
    initialVariables: {
        size: 'medium'
    },
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                title
                podcast {
                    artwork(size:$size)
                }
            }
        `
    }
});