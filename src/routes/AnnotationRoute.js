import Relay from 'react-relay';

export default class extends Relay.Route {

  static routeName = 'AnnotationRoute';

  static paramDefinitions = {
    annotationId: {
      required: true
    }
  };

  static queries = {
    annotation: () => Relay.QL`query { node(id: $annotationId) }`
  };
}
