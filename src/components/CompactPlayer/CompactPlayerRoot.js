import React, {
    Component,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import EpisodeRoute from '../../routes/EpisodeRoute';
import CompactPlayer from './CompactPlayer';
import MiniPlayer from '../Player/MiniPlayer';
import RelayError from '../common/RelayError';
import LoadingSpinner from '../common/LoadingSpinner';

import {episodeId$} from '../../redux/modules/player';

class PlayerRoot extends Component {

    renderFailure(error, retry) {
        console.warn('relay error loading compact player', error);
        return (
            <TouchableOpacity style={{height: 40, alignItems: 'center', justifyContent: 'center'}} onPress={retry}>
                <Text style={{color: 'white'}}>Error loading - tap to retry.</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {episodeId} = this.props;
        console.info('compact player component sees episode id: ', episodeId);

        if (!episodeId) return <View />;
        let route = new EpisodeRoute({
            episodeId: this.props.episodeId
        });
        return (
            <Relay.RootContainer
                Component={MiniPlayer}
                route={route}
                renderFailure={this.renderFailure}
                renderLoading={() => <MiniPlayer loading episode={null} />}
            />
        )
    }
}

export const playerRoot$ = createSelector(episodeId$, (episodeId) => ({
    episodeId
}));

export default connect(playerRoot$)(PlayerRoot);