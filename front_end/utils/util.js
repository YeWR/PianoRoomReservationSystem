/*******************************************************************************************************
 * common functions defined here
 *******************************************************************************************************/

const BEGINHOUR = 8;
const BEGINMINUTE = 0;
const ENDHOUR = 22;
const ENDMINUTE = 0;
// interval -> 10 => 8:00 8:10 8:20...
const TIMEINTERVAL = 10;

const formatNumber = (n) => {
    n = n.toString();
    return n[1] ? n : '0' + n
};

const formatTime = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatDate = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return [year, month, day].map(formatNumber).join('-');
};

// alert an info
const alertInfo = (title, icon, duration) => {
    wx.showToast({
        title: title,
        icon: icon,
        duration: duration
    });
};

// add some paras to url;
// @paras is dict
const setUrl = (rawUrl, paras) => {
    let url = rawUrl + "?";
    let flag = 0;
    for (let key in paras) {
        if (flag) {
            url += "&";
        }
        else {
            flag = 1;
        }
        url = url + key + "=" + paras[key];
    }
    return url;
};

/*
 * get the index when given the hour and the time
 */
const getIndexInTimeTable = (hour, minute) => {
    let index = (hour - BEGINHOUR) * parseInt(60 / TIMEINTERVAL);
    index = index + parseInt((minute - BEGINMINUTE) / TIMEINTERVAL);
    return index;
};

/*
 * get the len of time table
 */
const getTimeTableLen = () => {
    let beg = getIndexInTimeTable(BEGINHOUR, BEGINMINUTE);
    let end = getIndexInTimeTable(ENDHOUR, ENDMINUTE);
    return end - beg;
};

/*
 * get the hour and minute given the begin time and the interval
 */
const getEndTime = (begHour, begMinute, interval) => {
    let hour = parseInt(interval / 6);
    let minute = (interval % 6) * 10;
    let endHour = begHour + hour;
    let endMinute = begMinute + minute;
    return [endHour, endMinute]
};

/*
 * get the nearest time from begin time given the restraint time table(6 x 14)
 * map from the time to the index in time string
 * eg: begin time : 8:00 -> 0; 8:10 -> 1 ... ;
 * time interval: end time - beg time
 * eg: end time = 8:50 and beg time = 8:00 -> interval = 5 means [8:00, 8:50]
 */
const getNearestEndTime = (begHour, begMinute, timeTable) => {
    let tableLen = getTimeTableLen();
    if (timeTable === null || timeTable.length !== tableLen) {
        console.log("timeTable error.");
        return null;
    }

    let begIndex = getIndexInTimeTable(begHour, begMinute);
    let interval = 0;
    for (let i = begIndex; i < tableLen; ++i) {
        // is free
        if (timeTable[i] === 0) {
            interval++;
        }
    }
    return getEndTime(begHour, begMinute, interval);
};

/*
 * set time template
 * return the hours and minutes in selective tools
 * currentHours and currentMinute -> the first time you choose
 * lastHour and lastMinute -> the last time you choose
 * selectHour -> what you choose in the tools
 */
const setTimeTemplate = (hours, minutes, currentHours, currentMinute, lastHour, lastMinute, selectedHour) => {
    let minuteIndex;
    if (currentMinute === 0) {
        minuteIndex = 0;
    }
    else {
        minuteIndex = parseInt((currentMinute - 1) / 10) + 1;
    }

    let firstHour = currentHours;
    let firstMinute = currentMinute;

    if (minuteIndex === 6) {
        firstHour++;
        firstMinute = 0;
    }
    else {
        firstMinute = minuteIndex * 10;
    }

    for (let i = firstHour; i <= lastHour; i++) {
        hours.push(i);
    }

    // 15:10 - 15:40
    if (firstHour === lastHour) {
        for (let i = firstMinute; i <= lastMinute; i += 10) {
            minutes.push(i);
        }
    }
    else {
        // select first hour
        if (selectedHour === firstHour) {
            for (let i = firstMinute; i < 60; i += 10) {
                minutes.push(i);
            }
        }
        else if (selectedHour === lastHour) {
            for (let i = 0; i <= lastMinute; i += 10) {
                minutes.push(i);
            }
        }
        else {
            for (let i = 0; i < 60; i += 10) {
                minutes.push(i);
            }
        }
    }
};

module.exports = {
    alertInfo: alertInfo,
    formatTime: formatTime,
    formatDate: formatDate,
    setUrl: setUrl,
    getNearestEndTime: getNearestEndTime,
    ENDHOUR: ENDHOUR,
    ENDMINUTE: ENDMINUTE,
    setTimeTemplate: setTimeTemplate
};
