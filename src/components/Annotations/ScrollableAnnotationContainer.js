import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import _ from 'lodash';

import ScrollableAnnotationView from './ScrollableAnnotationView';

export default class ScrollableAnnotationContainer extends Component {

    state = {
        annotations: []
    };


    componentDidMount() {
        let num = 0;
        this._addAnnotationInterval = setInterval(() => {
            let annotations = this.state.annotations.slice();
            let fakeText = 'skadfh askdf hsfhj afjskg This is some long fake text to see how many words can fit before we start having problems';
            num++;
            if (num >= fakeText.split(' ').length) num = 1;
            let annotation = {
                id: Math.random() + '',
                text: `[${num}] ${fakeText.split(' ').splice(0, num).join(' ')}`,
                user: {
                    facebookId: '10153907632414490'
                }
            };
            annotations.push(annotation);
            // Remove in 15 s
            setTimeout(() => {
                this.setState({
                    annotations: _.without(this.state.annotations, annotation)
                });
            }, 15000);
            this.setState({annotations});
        }, 2000)
    }

    componentWillUnmount() {
        clearInterval(this._addAnnotationInterval)
    }

    render() {
        /**
         * ScrollableAnnotationView prefers annotations in newest-to-oldest order
         */
        return (
            <View style={styles.wrapper}>
                <ScrollableAnnotationView annotations={this.state.annotations.slice().reverse()} />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});