export const ROOT = __DEV__ ? 'http://localhost:8080' : 'https://podcastfoo.herokuapp.com';

export const episodeShareLink = (podcastId, episodeId, userId, time) => {
    let url = `${ROOT}/${podcastId}/${episodeId}/${userId}`;
    if (time) url = `${url}?time=${time}`;
    return url;
};