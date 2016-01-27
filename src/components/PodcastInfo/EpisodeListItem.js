import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class EpisodeListItem extends Component {

    static propTypes = {
        title: PropTypes.string
    };

    static defaultProps = {

    };

    render() {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.title}>{this.props.title}</Text>
                <View style={{width: 12, height: 12, borderRadius: 6, backgroundColor: this.props.hasAudio ? '#66BB6A' : '#DB4B23', opacity: 0.3}}></View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20
    },
    title: {
        color: 'white',
        fontSize: 16,
        //marginBottom: 20,
        padding: 20,
        flex: 1
    }
});