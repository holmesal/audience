export const ROOT = 'https://podcastfoo.herokuapp.com';

export const episodeShareLink = (podcastId, episodeId, userId) => {
    let url = `${ROOT}/${podcastId}/${episodeId}/${userId}`;
    return url;
};