import NotificationActions from 'react-native-ios-notification-actions'
import {PushNotificationIOS} from 'react-native';

// Create an "upvote" action that will display a button when a notification is swiped
let recommendButton = new NotificationActions.Action({
    activationMode: 'background',
    title: '👍',
    identifier: 'RECOMMEND_ACTION'
}, (res, done) => {
    console.info('recommend button pressed with result: ', res);
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
    console.info('showing recommend notification!');
    PushNotificationIOS.presentLocalNotification({
        alertBody: 'Would your friends dig this episode?',
        alertAction: 'recommend',
        userInfo: {
            episodeId
        },
        category: 'RECOMMEND_EPISODE'
    });
};

//setTimeout(() => {
//    showRecommendNotification(1234);
//}, 5000);