import Relay from 'react-relay';

export default class UpdateOneSignalPlayerId extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation { updateOneSignalPlayerId }`;
    }

    getVariables() {
        return {
            oneSignalPlayerId: this.props.oneSignalPlayerId
        }
    }
    //
    getFatQuery() {
        return Relay.QL`fragment on UpdateOneSignalPlayerIdPayload {
            user
        }`;
    }

    //// TODO - implement node create config?
    getConfigs() {
        return [];
    }
}