/*******************************************************************************************************
 * common functions defined here
 *******************************************************************************************************/

// alert an info
const alertInfo = (title, icon, duration) => {
    wx.showToast({
        title: title,
        icon: icon,
        duration: duration
    });
};

module.exports = {
    alertInfo: alertInfo
};
