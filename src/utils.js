import moment from 'moment';

export const prettyFormatTime = (t) => {
    let d = moment.duration(Math.floor(t), 'seconds');
    let h = Math.floor(d.asHours());
    let m = Math.floor(d.asMinutes() - 60 * h);
    let s = Math.floor(d.asSeconds() - 3600 * h - 60 * m);

    if (s < 10) {
        s = '0' + s;
    }

    if (h > 0 && m < 10) {
        m = '0' + m;
    }
    let formatted = `${m}:${s}`;

    if (h > 0) {
        formatted = `${h}:${formatted}`;
    }
    return formatted;
};