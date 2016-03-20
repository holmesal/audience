import NotificationActions from 'react-native-ios-notification-actions'
import {
    AppStateIOS,
    PushNotificationIOS
} from 'react-native';
import Relay from 'react-relay';
import RecommendEpisodeMutation from './mutations/RecommendEpisode';

function recommend(episodeId, review) {
    console.info('recommending', episodeId, review);
    Relay.Store.commitUpdate(new RecommendEpisodeMutation({
        episodeId,
        review
    }), {
        onFailure: (transaction) =>  {
            console.error(transaction.getError());
        },
        onSuccess: (res) => {
            console.info('successfully recommended episode', res);
        }
    });
}

// Create an "upvote" action that will display a button when a notification is swiped
let recommendButton = new NotificationActions.Action({
    activationMode: 'background',
    title: '👍',
    identifier: 'RECOMMEND_ACTION'
}, (res, done) => {
    console.info('recommend button pressed with result: ', res);
    recommend(res.userInfo.episodeId);
    done(); //important!
});

//let doNotRecommendButton = new NotificationActions.Action({
//    activationMode: 'background',
//    title: '👎',
//    destructive: true,
//    identifier: 'DO_NOT_RECOMMEND_ACTION'
//}, (res, done) => {
//    console.info('do NOT recommend button pressed from source: ', source);
//    done(); //important!
//});

// Create a "comment" button that will display a text input when the button is pressed
let recommendWithCommentButton = new NotificationActions.Action({
    activationMode: 'background',
    title: '💬',
    behavior: 'textInput',
    identifier: 'REPLY_ACTION'
}, (res, done) => {
    console.info(`recommendation added with comment: "${res.text}" and result:`, res);
    recommend(res.userInfo.episodeId, res.text);
    done(); //important!
});

// Create a category containing our two actions
let myCategory = new NotificationActions.Category({
    identifier: 'RECOMMEND_EPISODE',
    actions: [recommendButton, recommendWithCommentButton],
    forContext: 'default'
});

// ** important ** update the categories
NotificationActions.updateCategories([myCategory]);

// Show a local notification to recommend an episode
export const showRecommendNotification = (episodeId) => {
    // TODO - disable this always-true when https://github.com/facebook/react-native/pull/6379/files lands
    // and the app is no longer perpetually-active
    if (true || AppStateIOS.currentState === 'background') {
        console.info('showing recommend notification!');
        PushNotificationIOS.presentLocalNotification({
            alertBody: 'Would your friends dig this episode?',
            alertAction: 'recommend',
            userInfo: {
                episodeId
            },
            category: 'RECOMMEND_EPISODE'
        });
    } else {
        console.info('not showing as app is not in background: state=', AppStateIOS.currentState);
    }
};

//setTimeout(() => {
//    showRecommendNotification('RXBpc29kZTo0Nzk=');
//}, 10000);


// Add a listener to handle launches from push notifications
PushNotificationIOS.addEventListener('notification', (notification) => {
    console.info('oh snap got a notiication', notification)
});