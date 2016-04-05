import React, {
    Component,
    Image,
    NavigationExperimental,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import DebugView from '../../common/DebugView';

const {
    Reducer
} = NavigationExperimental;

export const FeedTabKey = 'FeedTab';

export const FeedTabReducer = Reducer.StackReducer({
    getPushedReducerForAction: (action, lastState) => {
        console.info('[FeedTab] handling action: ', action, lastState);
    },
    initialState: {
        key: FeedTabKey,
        index: 0,
        children: [
            {key: 'base'}
        ]
    }
})

export default class Feed extends Component {

    render() {
        console.info('[FeedTab] rendering!', this.props);
        return (
            <DebugView text="FeedTab" />
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});