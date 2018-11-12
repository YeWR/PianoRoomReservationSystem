// pages/reserve/reserve_confirm/reserve_confirm.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _realName: "",
        _idNumber: "",
        _userType: "",
        _date: "",
        _begTime: "",
        _endTime: "",
        _begTimeIndex: -1,
        _endTimeIndex: -1,
        _pianoPlace: "",
        _pianoPrice: ""
    },

    /*
     * confirm reservation
     * TODO: do not foret to pay for the reservation and check
     */
    confirmReservation: function(e){
        let that = this;
        wx.request({
            url: "https://958107.iterator-traits.com/reserve/order",
            data: {
                phoneNumber: that.data._phoneNumber,
                pianoId:that.data._pianoId,
                userType:that.data._userType,
                pianoPrice:that.data._pianoPrice,
                begTimeIndex:that.data._begTimeIndex,
                endTimeIndex:that.data._endTimeIndex
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if(res.data.success){
                    util.alertInfo("预约成功！", "success", 500);
                    that.toAlarm();
                }
            },
            fail: function (res) {
                util.alertInfo("预约失败，请检查网络设备是否正常。", "none", 1000);
            }
        });
    },

    /*
     * to alarm
     */
    toAlarm: function(){
        wx.switchTab({
            url: "../../alarm/alarm"
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            _realName: options.realName,
            _idNumber: options.idNumber,
            _userType: options.userType,
            _date: options.date,
            _begTime: options.begTime,
            _endTime: options.endTime,
            _pianoPlace: options.pianoPlace,
            _pianoPrice: options.pianoPrice
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});