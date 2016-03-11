import React, {
    ActivityIndicatorIOS,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {connect} from 'react-redux';

import {checkLogin, auth$} from '../../redux/modules/auth';
import Landing from './../Landing/Landing';
import Authenticated from './Authenticated';

// Responds to changes in auth state from redux, and renders the appropriate component
class Auth extends Component {

    checkLogin() {
        this.props.dispatch(checkLogin());
    }

    componentWillMount() {
        this.checkLogin();
    }

    renderLoading() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicatorIOS />
            </View>
        )
    }

    render() {
        if (!this.props.checkedLogin) {
            return this.renderLoading()
        } else {
            return this.props.loggedIn ?
                <Authenticated /> :
                <Landing onLogin={this.checkLogin.bind(this)} />;
        }
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default connect(auth$)(Auth);