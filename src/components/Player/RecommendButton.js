import React, {
    AlertIOS,
    Component,
    PropTypes,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Relay from 'react-relay';
import RecommendEpisodeMutation from '../../mutations/RecommendEpisode';

import CircleCaptionButton from './CircleCaptionButton';

class RecommendButton extends Component {

    state = {
        recommending: false
    };

    static propTypes = {
        onError: React.PropTypes.func
    };

    recommend() {
        let {podcastId, episodeId} = this.props;
        console.info('todo - add recommendation');
        AlertIOS.prompt(
            'Add a comment?',
            'This is optional.',
            [
                {text: 'Recommend', onPress: this.recommendMutation.bind(this), style: 'default'},
            ]
        )
    }

    recommendMutation(review) {
        console.info('recommending', this.props.episode.id, review, Relay.Store.commitUpdate);
        Relay.Store.update(new RecommendEpisodeMutation({
            episodeId: this.props.episode.id,
            review
        }), {
            onFailure: (transaction) =>  {
                console.error(transaction.getError());
                this.setState({recommending: false});
            },
            onSuccess: (res) => {
                console.info('successfully recommended episode', res);
                this.setState({recommending: false});
            }
        });
    }

    renderNotRecommended() {
        return (
            <CircleCaptionButton
                content="👍"
                caption="RECOMMEND"
                onPress={this.recommend.bind(this)}
            />
        )
    }

    renderRecommending() {
        return (
            <CircleCaptionButton
                content="👍"
                caption="RECOMMEND"
                buttonStyle={{opacity: 0.3}}
            />
        )
    }

    renderRecommended() {
        console.info('has recommended!')
        return (
            <CircleCaptionButton
                content="👍"
                caption="RECOMMENDED"
                buttonStyle={{opacity: 0.3}}
            />
        )
    }

    render() {
        console.info(this.props, this.state);
        if (this.state.recommending) return this.renderRecommending();
        else {
            if (this.props.episode.viewerHasRecommended) return this.renderRecommended();
            else return this.renderNotRecommended()
        }
    }
}

export default Relay.createContainer(RecommendButton, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                viewerHasRecommended
            }
        `,
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
            }
        `
    }
})