import React, {
    Component,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux/native';
import {createSelector} from 'reselect';

import SearchRoute from '../../routes/SearchRoute';
import Search from './Search';

import {query$} from '../../redux/modules/search';

class SearchRoot extends Component {

    render() {
        console.info('search root component sees query: ', this.props.query);

        let route = new SearchRoute({
            text: this.props.query
        });
        return (
            <Relay.RootContainer
                Component={Search}
                route={route}
                renderFailure={function(error, retry) {
                    console.info(error);
                    return (
                    <View>
                        <Text style={{color: 'white'}}>{error.message}</Text>
                    </View>
                    );
                }}
            />
        )
    }
}

export const searchRoot$ = createSelector(query$, (query) => ({
    query
}));

export default connect(searchRoot$)(SearchRoot);