export const ROOT = __DEV__ ? 'http://localhost:8080' : 'https://podcastfoo.herokuapp.com';

export const episodeShareLink = (podcastId, episodeId, userId) => {
    return  `${ROOT}/${podcastId}/${episodeId}/${userId}`;
};