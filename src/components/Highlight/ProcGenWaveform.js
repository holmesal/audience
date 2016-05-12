import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
    Group,
    Path,
    Shape,
    Surface,
    Transform
} from 'ReactNativeART';

const strokeWidth = 1.5;
const spacing = 6;

export default class ProcGenWaveform extends Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number,
        strokeColor: PropTypes.string
    };

    static defaultProps = {
        width: 100,
        height: 70,
        strokeColor: '#50ABF1'
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.width != this.props.width ||
            nextProps.height != this.props.height ||
            nextProps.strokeColor != this.props.strokeColor
        ) return true;
        return false;
    }

    renderBar(position, idx) {
        // Translate
        const trans = new Transform().translate(idx*spacing + strokeWidth/2);
        // Make path
        let path = new Path();
        // dims
        let length = position * this.props.height - strokeWidth; //tip-to-tail, adjusted for stroke caps
        let y1 = (this.props.height - length) / 2; // top y
        let y2 = y1 + length; // bottom y
        // move to start
        path.move(0, y1);
        // draw to end
        path.lineTo(0, y2);
        // render shape
        return <Shape key={idx} d={path} strokeWidth={strokeWidth} stroke={this.props.strokeColor} strokeCap="round" transform={trans} />
    }


    render() {
        console.info('rendering procedurally generated waveform!', this.props);
        // How many lines should there be?
        const lineCount = Math.floor(this.props.width / spacing);

        // Generate the lines
        const positions = _.map(_.range(0, lineCount), i => Math.sin(i/5) * Math.random() / 2 + 0.5);

        // Render a bar for each position
        const bars = positions.map(this.renderBar.bind(this));

        return (
            <View style={[styles.wrapper, this.props.style]}>
                <Surface width={this.props.width}
                         height={this.props.height}>
                    {bars}
                </Surface>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        //backgroundColor: 'red'
    }
});