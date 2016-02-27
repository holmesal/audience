import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Switch,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Relay from 'react-relay';
import colors from '../../colors';

import SubscribeToPodcastMutation from '../../mutations/SubscribeToPodcast';

class FollowToggle extends Component {

    handleValueChange(val) {
        Relay.Store.update(new SubscribeToPodcastMutation({
            podcast: this.props.podcast
        }), {
            onFailure: (transaction) => {
                console.error(transaction.getError())
            },
            onSuccess: (res) => {
                console.info('success!', res)
            }
        })
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.text}>
                    <Text style={styles.header}>Follow this podcast</Text>
                    <Text style={styles.supporting}>It'll show up in your "Shows" list</Text>
                </View>
                <Switch
                    value={this.props.podcast.viewerIsSubscribed}
                    thumbTintColor={colors.lightGrey}
                    tintColor={colors.grey}
                    onValueChange={this.handleValueChange.bind(this)}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20
    },
    text: {
        flex: 1,
        justifyContent: 'center'
    },
    header: {
        color: colors.lightGrey,
        fontFamily: 'System',
        fontWeight: '500',
        fontSize: 14,
        marginBottom: 2
    },
    supporting: {
        color: colors.grey,
        fontFamily: 'System',
        fontWeight: '300',
        fontSize: 12
    }
});

export default Relay.createContainer(FollowToggle, {
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                viewerIsSubscribed
                ${SubscribeToPodcastMutation.getFragment('podcast')}
            }
        `
    }
})