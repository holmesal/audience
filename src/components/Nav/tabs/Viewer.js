import React, {
    Component
} from 'react-native';

import ViewerRoot from '../../Viewer/ViewerRoot';
import PureRenderMixin from 'react-addons-pure-render-mixin';
export const ViewerTabKey = 'ViewerTab';

const rootState = {
    key: ViewerTabKey,
    tabLabel: 'Account',
    tabIcon: 'person'
};

export const ViewerTabReducer = (state, action) => state || rootState;

export default class Viewer extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        return <ViewerRoot />
    }
}