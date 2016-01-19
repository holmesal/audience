import React, {
    Component,
    Image,
    ScrollView,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import ResultItem from './ResultItem';

export default class Results extends Component {

    static defaultProps = {
        results: [
            {type: 'podcast', podcastId: '12345', primary: 'The Smartest Man in the World - A Lovable Proopscast', secondary: 'Podcast', photoUrl: 'http://lorempixel.com/200/200?111'},
            {type: 'podcast', podcastId: '12345', primary: 'HarmonTown', secondary: 'Podcast', photoUrl: 'http://lorempixel.com/200/200?222'},
            {type: 'podcast', podcastId: '12345', primary: 'Stuff You Should Know', secondary: 'Podcast', photoUrl: 'http://lorempixel.com/200/200?333'}
        ]
    };

    renderResults() {
        return this.props.results.map(res => {

            let handlePress;
            let photoShape = 'square';
            if (res.type === 'podcast') handlePress = ev => this.gotoPodcast(res.podcastId);

            return (
                <ResultItem
                    key={res.primary}
                    primary={res.primary}
                    secondary={res.secondary}
                    photoUrl={res.photoUrl}
                    photoShape={photoShape}
                />
            )
        });
    }

    render() {

        return (
            <ScrollView style={style.wrapper} contentContainerStyle={{paddingTop: 64}}>
                {this.renderResults()}
                <TouchableOpacity onPress={this.props.showPlayer}><View  style={{flex: 1, alignSelf: 'stretch', height: 300}}></View></TouchableOpacity>
            </ScrollView>
        );
    }
}

let style = {
    wrapper: {
        flex: 1,
    }
};