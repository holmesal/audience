import _ from 'lodash';

let colors = [
    '#50ABF1',
    '#CF7883',
    '#F5A623',
    '#66BB6A',
    '#41505C'
];

let tintsByUser = {};

export const tintOpacity = 0.64;

export const getTintForUser = (uid) => {
    let existingTint = tintsByUser[uid];
    if (!existingTint) {
        let randomColor = _.sample(colors);
        tintsByUser[uid] = existingTint = randomColor;
    }
    return existingTint;
};