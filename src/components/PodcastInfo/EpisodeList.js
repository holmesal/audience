import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Spinner from 'react-native-spinkit';

import colors from '../../colors';

export default class EpisodeList extends Component {

    static propTypes = {
        episodes: PropTypes.array
    };

    static defaultProps = {

    };

    renderLoading() {
        return (
            <Spinner
                color={colors.lightGrey}
                type="Wave"
                style={{opacity: 0.2}}
            />
        )
    }

    render() {
        return (
            <View style={styles.wrapper}>
                {this.renderLoading()}
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center'
    }
});