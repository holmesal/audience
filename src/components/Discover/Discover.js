import React, {
    Component,
    Image,
    PropTypes,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import _ from 'lodash';

import Recommendation from './Recommendation';

export default class Discover extends Component {

    refresh() {
        console.info('doing refresh!');
    }

    renderRefreshControl() {
        return (
            <RefreshControl
                onRefresh={this.refresh.bind(this)}
                tintColor="#aaaaaa"
            />
        )
    }

    renderStream() {
        return (
            <View>
                <Recommendation style={styles.recommendation} />
                <Recommendation style={styles.recommendation} />
            </View>
        )
    }

    render() {
        return (
            <ScrollView
                style={styles.wrapper}
                refreshControl={this.renderRefreshControl()}
            >
                {this.renderStream()}
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: 40
    },
    recommendation: {
        marginBottom: 40
    }
});