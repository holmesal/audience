import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import _ from 'lodash';
import Relay from 'react-relay';
import FloatingAnnotation from './FloatingAnnotation'
import PlaceKeeper from './PlaceKeeper';

export default class AnnotationSpawner extends Component {

    state = {
        lastSeenIdx: null,
        visible: [],
        offsets: {}
    };

    componentDidUpdate(prevProps, prevState) {

    }

    reset() {
        console.info('resetting!');
        this.setState({
            visible: [],
            offsets: {}
        });
    }

    handleAnnotationLayout(layout, fromId) {
        // Offset the existing annotations
        let offsets = _.assign({}, this.state.offsets);
        _.forEach(this.state.offsets, (offset, id) => {
            //console.info(id, offset)
            if (!offset) offset = 0;
            if (id != fromId) {
                offset += layout.height;
            }
            //console.info('new offset for ', edge.node.id, )
            offsets[id] = offset;
        });
        this.setState({offsets});
    }

    handleChangeLastSeenIdx(lastSeenIdx, skipping) {
        console.info('did change last seen idx: ', lastSeenIdx);
        if (this.state.lastSeenIdx != lastSeenIdx) {
            // LastSeenIdx changed, we need to add or remove things
            if (lastSeenIdx < this.state.lastSeenIdx) {
                console.info('TODO - going backwards, remove annotations');
                this.reset();
            } else if (skipping) {
                this.reset();
            } else {
                // Going forwards, add annotations
                let visible = this.state.visible.slice();
                let offsets = this.state.offsets;
                // If we're at the start, show that one, else omit
                let start = lastSeenIdx ===  0 ? 0 : this.state.lastSeenIdx + 1;
                let end = lastSeenIdx;
                //console.info(`${start} ---< ${end}`);
                for (let i = start; i <= end; i++) {
                    console.info('spawning: ', i, this.props.episode.annotations.edges[i].node.id, `onscreencount: ${this.state.visible.length}`);
                    let edge = this.props.episode.annotations.edges[i];
                    visible.push(edge);
                    offsets[edge.node.id] = 0;
                }

                this.setState({visible, offsets});
            }
            this.setState({lastSeenIdx});
        }
    }

    renderAnnotations() {
        return this.state.visible.map(edge =>
            <FloatingAnnotation
                key={edge.node.id}
                annotation={edge.node}
                offset={this.state.offsets[edge.node.id] || 0}
                onLayout={(layout) => this.handleAnnotationLayout(layout, edge.node.id)}
                onDie={() => {
                    this.setState({visible: _.without(this.state.visible, edge)})
                }}
            />)
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <PlaceKeeper
                    edges={this.props.episode.annotations.edges}
                    onChangeLastSeenIdx={this.handleChangeLastSeenIdx.bind(this)}
                />
                {this.renderAnnotations()}
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden'
    }
});

export default Relay.createContainer(AnnotationSpawner, {
    initialVariables: {
        size: 'small'
    },
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                description
                annotations(first: 100) {
                    edges {
                        node {
                            id
                            time
                            ${FloatingAnnotation.getFragment('annotation')}
                        }
                    }
                }
            }
        `
    }
});