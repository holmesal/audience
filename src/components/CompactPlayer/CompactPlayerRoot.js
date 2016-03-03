import React, {
    Component,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux/native';
import {createSelector} from 'reselect';

import EpisodeRoute from '../../routes/EpisodeRoute';
import CompactPlayer from './CompactPlayer';
import RelayError from '../common/RelayError';
import LoadingSpinner from '../common/LoadingSpinner';

import {episodeId$} from '../../redux/modules/player';

class PlayerRoot extends Component {

    render() {
        const {episodeId} = this.props;
        console.info('compact player component sees episode id: ', episodeId);

        if (!episodeId) return <View />;
        let route = new EpisodeRoute({
            episodeId: this.props.episodeId
        });
        return (
            <Relay.RootContainer
                Component={CompactPlayer}
                route={route}
                renderFailure={() => <Text>Error?</Text>}
                renderLoading={() => <View />}
            />
        )
    }
}

export const playerRoot$ = createSelector(episodeId$, (episodeId) => ({
    episodeId
}));

export default connect(playerRoot$)(PlayerRoot);