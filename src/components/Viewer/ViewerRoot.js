import React, {
    Component
} from 'react-native';
import Relay from 'react-relay';

import viewerRoute from '../../routes/ViewerRoute';
import Viewer from './Viewer';

export default class ViewerRoot extends Component {

    render() {
        let route = new viewerRoute();
        return (
            <Relay.RootContainer
                Component={Viewer}
                route={route}
            />
        )
    }
}