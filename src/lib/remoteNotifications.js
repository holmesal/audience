import OneSignal from 'react-native-onesignal';
import Relay from 'react-relay';
import {getViewerId} from '../utils/relay';
import UpdateOneSignalPlayerIdMutation from '../mutations/UpdateOneSignalPlayerId';
import EventEmitter from 'EventEmitter';

class RemoteNotifications extends EventEmitter {

    updated = false;
    playerId = null;

    constructor() {
        super();
        // Register when IDS are available
        OneSignal.idsAvailable((idsAvailable) => {
            //console.log(idsAvailable.pushToken);
            this.playerId = idsAvailable.playerId;
            console.log('got onesignal playerId: ', this.playerId);
            if (getViewerId()) {
                this.updatePlayerId();
            }
        });

        OneSignal.configure({
            onNotificationOpened: this.handleNotificationOpen.bind(this)
        });

        //console.info(OneSignal);

        //setTimeout(() => {
        //    this.handleNotificationOpen('test', {
        //        annotationId: 'QW5ub3RhdGlvbjoxMzg=',
        //        type: 'annotation'
        //    });
        //}, 2000);
    }

    handleNotificationOpen(message, data, isActive) {
        console.info('notification opened', {message, data, isActive});
        // Only respond if in the background
        if (!isActive) {
            this.emit('notificationOpened', data);
        }
    }

    updatePlayerId() {
        if (this.updated) {
            console.info('skipping updating onesignal playerId - has already been updated');
            return false;
        }
        console.info('updating onesignal playerId: ', this.playerId);

        const mutation = new UpdateOneSignalPlayerIdMutation({
            oneSignalPlayerId: this.playerId
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
    }
}

export default new RemoteNotifications();