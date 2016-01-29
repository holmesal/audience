import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Spinner from 'react-native-spinkit';
import EpisodeListItem from './EpisodeListItem';

import {connect} from 'react-redux/native';
import {episodeList$} from '../../redux/modules/episodes';
import {playEpisode} from '../../redux/modules/player';

import colors from '../../colors';

class EpisodeList extends Component {

    static propTypes = {
        episodes: PropTypes.array,
        doneAnimating: PropTypes.bool
    };

    static defaultProps = {

    };

    renderLoading() {
        return (
            <View style={{flex: 1, height: 400, alignItems: 'center', justifyContent: 'center'}}>
                <Spinner
                    color={colors.lightGrey}
                    type="Wave"
                    style={{opacity: 0.2}}
                />
            </View>
        )
    }

    renderEpisodeList() {
        return this.props.episodes.map((ep, idx) => (
            <EpisodeListItem
                title={ep.title}
                description={ep.description}
                key={ep.uid}
                duration={ep.duration}
                unheard={false}
                onPress={() => this.props.dispatch(playEpisode(this.props.podcastId, ep.uid))}
            />
        ))
    }

    render() {
        console.info('episode list props', this.props);
        let view = this.props.episodes.length > 0 && this.props.doneAnimating ? this.renderEpisodeList() : this.renderLoading();
        return (
            <View style={styles.wrapper}>
                {view}
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1,
        //height: 400,
        //alignItems: 'center',
        //justifyContent: 'center'
    }
});

export default connect(episodeList$)(EpisodeList)