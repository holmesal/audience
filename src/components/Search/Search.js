import React, {
    Component,
    Image,
    Text,
    View
} from 'react-native';

export default class Search extends Component {

    render() {
        return (
            <View style={style.wrapper}>
                <Text>I am the Search component!</Text>
            </View>
        );
    }
}

let style = {
    wrapper: {
        flex: 1
    }
};