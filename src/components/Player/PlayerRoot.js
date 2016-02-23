import React, {
    Component,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux/native';
import {createSelector} from 'reselect';

import EpisodeRoute from '../../routes/EpisodeRoute';
import Player from './Player';
import RelayError from '../RelayError';

import {episodeId$} from '../../redux/modules/player';

class PlayerRoot extends Component {

    render() {
        const {episodeId} = this.props;
        console.info('player root component sees episode id: ', episodeId);

        if (!episodeId) return <View />;
        let route = new EpisodeRoute({
            episodeId: this.props.episodeId
        });
        return (
            <Relay.RootContainer
                Component={Player}
                route={route}
                renderFailure={function(error, retry) {
                    console.info(error)
                    return (
                        <RelayError error={error} retry={retry} />
                    );
                }}
            />
        )
    }
}

export const playerRoot$ = createSelector(episodeId$, (episodeId) => ({
    episodeId
}));

export default connect(playerRoot$)(PlayerRoot);