let URL = 'https://podcastfoo.herokuapp.com';

export const episodeShareLink = (podcastId, episodeId, userId) => {
    let url = `${URL}/${podcastId}/${episodeId}/${userId}`;
    return url;
};