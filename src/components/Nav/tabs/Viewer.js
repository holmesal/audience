import React, {
    Component
} from 'react-native';

import ViewerRoot from '../../Viewer/ViewerRoot';

export const ViewerTabKey = 'ViewerTab';

const rootState = {
    key: ViewerTabKey,
    tabLabel: 'Account',
    tabIcon: 'person'
};

export const ViewerTabReducer = (state, action) => state || rootState;

export default class Viewer extends Component {

    render() {
        return <ViewerRoot />
    }
}