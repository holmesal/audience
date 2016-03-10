import React, {
    Component,
    Image,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import Annotation from './Annotation';

class Annotations extends Component {

    static propTypes = {

    };

    static defaultProps = {

    };

    renderAnnotations() {
        return this.props.episode.annotations.edges.map(edge => <Annotation key={edge.node.id} annotation={edge.node} />);
    }

    render() {
        return (
            <ScrollView style={styles.wrapper}>
                {this.renderAnnotations()}
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default Relay.createContainer(Annotations, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                annotations(first: 100) {
                    edges {
                        node {
                            id
                            ${Annotation.getFragment('annotation')}
                        }
                    }
                }
            }
        `
    }
});