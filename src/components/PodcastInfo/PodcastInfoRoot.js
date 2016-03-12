import React, {
    Component,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import LoadingSpinner from '../common/LoadingSpinner';
import PodcastRoute from '../../routes/PodcastRoute';
import PodcastInfo from './PodcastInfo';
import RelayError from '../common/RelayError';

import {podcastId$} from '../../redux/modules/podcastInfo';

class PodcastInfoRoot extends Component {

    render() {
        const {podcastId} = this.props;
        console.info('podcast info root component sees podcast id: ', podcastId);

        if (!podcastId) return <View />;
        let route = new PodcastRoute({
            podcastId: this.props.podcastId
        });
        return (
            <Relay.RootContainer
                Component={PodcastInfo}
                route={route}
                renderFailure={function(error, retry) {
                    console.info(error);
                    return (
                        <RelayError error={error} retry={retry} />
                    );
                }}
                renderLoading={() => {
                    return (
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <LoadingSpinner />
                        </View>
                    )
                }}
            />
        )
    }
}

export const sel$ = createSelector(podcastId$, (podcastId) => ({
    podcastId
}));

export default connect(sel$)(PodcastInfoRoot);