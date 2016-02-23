import React, {
    Component,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux/native';
import {createSelector} from 'reselect';

import SearchRoute from '../../routes/SearchRoute';
import Results from './Results';
import LoadingSpinner from '../LoadingSpinner';

import {query$} from '../../redux/modules/search';

class ResultsRoot extends Component {

    render() {
        //console.info('results root component sees query: ', this.props.query);
        let route = new SearchRoute({
            text: this.props.query
        });
        return (
            <Relay.RootContainer
                Component={Results}
                route={route}
                renderFailure={function(error, retry) {
                    console.info(error);
                    return (
                    <View>
                        <Text style={{color: 'white'}}>{error.message}</Text>
                    </View>
                    );
                }}
                renderLoading={() => <LoadingSpinner />}
            />
        )
    }
}

export const sel$ = createSelector(query$, (query) => ({
    query
}));

export default connect(sel$)(ResultsRoot);