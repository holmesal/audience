import React, {
    ActionSheetIOS,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import SubscribeToPodcastMutation from '../../mutations/SubscribeToPodcast';

class PodcastActionSheet extends Component {

    static propTypes = {};

    static defaultProps = {
        onComplete: () => {}
    };

    showOptions() {
        ActionSheetIOS.showActionSheetWithOptions({
            options: [
                this.props.podcast.viewerIsSubscribed ? 'Unfollow' : 'Follow',
                'Cancel'
            ],
            cancelButtonIndex: 1,
            destructiveButtonIndex: this.props.podcast.viewerIsSubscribed ? 0 : undefined
        }, idx => {
            if (idx === 0) {
                this.toggleSubscribed()
            }
            this.props.onComplete();
        })
    }

    toggleSubscribed() {
        Relay.Store.commitUpdate(new SubscribeToPodcastMutation({
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

    componentDidUpdate(prevProps, prevState) {
        //console.info('update!', this.props, prevProps);
        if (this.props.visible && this.props.visible != prevProps.visible) this.showOptions()
    }

    render() {
        return (
            <View />
        );
    }
}

export default Relay.createContainer(PodcastActionSheet, {

    initialVariables: {
        size: 'medium'
    },
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
                viewerIsSubscribed
                ${SubscribeToPodcastMutation.getFragment('podcast')}
            }
        `
    }
})