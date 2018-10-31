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

module.exports = {
    alertInfo: alertInfo,
    formatTime: formatTime,
    formatDate: formatDate
};
