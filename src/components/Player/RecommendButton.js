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
import colors from '../../colors';
import NavbarButton from './NavbarButton';
import Icon from 'react-native-vector-icons/Ionicons';

const iconSize = 28;

class RecommendButton extends Component {

    state = {
        recommending: false
    };

    static propTypes = {
        onError: React.PropTypes.func
    };

    recommend() {
        AlertIOS.prompt(
            'Add a comment?',
            'This is optional.',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Recommend', onPress: this.recommendMutation.bind(this), style: 'default'},
            ]
        )
    }

    recommendMutation(review) {
        console.info('recommending', this.props.episode.id, review, Relay.Store.commitUpdate);
        Relay.Store.commitUpdate(new RecommendEpisodeMutation({
            episode: this.props.episode,
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
            <NavbarButton onPress={this.recommend.bind(this)}>
                <Icon name="ios-heart-outline" color={colors.darkGrey} size={iconSize}/>
            </NavbarButton>
        )
    }

    renderRecommending() {
        return (
            <NavbarButton>
                <Icon name="ios-heart" color={colors.grey} size={iconSize}/>
            </NavbarButton>
        )
    }

    renderRecommended() {
        return (
            <NavbarButton>
                <Icon name="ios-heart" color={colors.blue} size={iconSize}/>
            </NavbarButton>
        )
    }

    render() {
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
                ${RecommendEpisodeMutation.getFragment('episode')}
            }
        `
    }
})