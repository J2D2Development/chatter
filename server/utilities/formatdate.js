'use strict';

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = monthNameMatrix[date.getMonth() - 1];
    const day = date.getDate();
    const hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if(minutes.toString().length === 1) {
        minutes = '0' + minutes.toString();
    }

    if(seconds.toString().length === 1) {
        seconds = '0' + seconds.toString();
    }

    return `${month} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
};

const monthNameMatrix = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
};

module.exports = formatDate;