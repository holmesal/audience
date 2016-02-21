import Relay from 'react-relay';

export default class extends Relay.Route {

  static routeName = 'EpisodeRoute';

  static paramDefinitions = {
    episodeId: {
      required: true
    }
  };

  static queries = {
    episode: () => Relay.QL`query { node(id: $episodeId) }`,
  };
}
