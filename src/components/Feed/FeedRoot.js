import React, {
    Component,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import viewerRoute from '../../routes/ViewerRoute';
import Feed from './Feed';
import RelayError from '../common/RelayError';
import LoadingSpinner from '../common/LoadingSpinner';

export default class FeedRoot extends Component {

    render() {
        console.info('Feed root is rendering!');
        let route = new viewerRoute();
        return (
            <Relay.RootContainer
                Component={Feed}
                route={route}
                renderFailure={function(error, retry) {
                    console.info(error);
                    return (
                        <RelayError error={error} retry={retry} />
                    );
                }}
                renderLoading={() => <LoadingSpinner />}
            />
        )
    }
}