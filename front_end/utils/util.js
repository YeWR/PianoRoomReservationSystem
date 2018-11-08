/*******************************************************************************************************
 * common functions defined here
 *******************************************************************************************************/

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

module.exports = {
    alertInfo: alertInfo,
    formatTime: formatTime,
    formatDate: formatDate,
    setUrl: setUrl
};
