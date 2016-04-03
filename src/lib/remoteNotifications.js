import OneSignal from 'react-native-onesignal';
import Relay from 'react-relay';
import {getViewerId} from '../utils/relay';
import UpdateOneSignalPlayerIdMutation from '../mutations/UpdateOneSignalPlayerId';

let updated = false;
let playerId = null;

OneSignal.idsAvailable((idsAvailable) => {
    //console.log(idsAvailable.pushToken);
    playerId = idsAvailable.playerId;
    console.log('got onesignal playerId: ', playerId);
    if (getViewerId()) {
        updatePlayerId();
    }
});

// Update this user's player id
export const updatePlayerId = () => {
    if (updated) {
        console.info('skipping updating onesignal playerId - has already been updated');
        return false;
    }
    console.info('updating onesignal playerId: ', playerId);

    const mutation = new UpdateOneSignalPlayerIdMutation({
        oneSignalPlayerId: playerId
    });

    Relay.Store.commitUpdate(mutation, {
        onSuccess: (data) => {
            console.info('successfully updated onesignal player id!');
        },
        onFailure: (transaction) => {
            let error = transaction.getError();
            console.error(error);
            console.info(transaction);
            console.error('Error updating onesignal player id :-(');
        }
    });


};