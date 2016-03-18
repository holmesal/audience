import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import ScrollableAnnotationView from './ScrollableAnnotationView';

export default class ScrollableAnnotationContainer extends Component {

    state = {
        annotations: []
    };


    componentDidMount() {
        this._addAnnotationInterval = setInterval(() => {
            let annotations = this.state.annotations.slice();
            annotations.push({
                id: Math.random() + '',
                text: 'Test annotation: ' + Date.now()
            });
            if (annotations.length > 5) annotations.shift();
            this.setState({annotations});
        }, 2000)
    }

    componentWillUnmount() {
        clearInterval(this._addAnnotationInterval)
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <ScrollableAnnotationView annotations={this.state.annotations} />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});