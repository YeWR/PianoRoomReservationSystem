// pages/alarm/alarm.js

let app = getApp();
let util = app.util;

/*
 * TODO: 之后可能用websocket
 */

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _reservationList: [],
    },

    /*
     * bind reservation detail
     * to detail
     */
    bindReserveDetail: function(e){
        let id = e.currentTarget.dataset.id;
        let paras = this.data._reservationList[id];

        let url = util.setUrl("./alarm_detail/alarm_detail", paras);
        wx.navigateTo({
            url: url
        });
    },

    /*
     * set reservation list
     */
    setReservationList: function(reservationList, that){
        let list = [];
        let scaleHour = util.BEGINHOUR;
        let scaleMinute = util.BEGINMINUTE;
        for(let i = 0; i < reservationList.length; ++i){
            const e = reservationList[i];
            let begTime = util.getEndTime(scaleHour, scaleMinute, e.begTimeIndex);
            let endTime = util.getEndTime(scaleHour, scaleMinute, e.endTimeIndex);

            let reservation = {};
            reservation.reservationId = e.reservationId;

            reservation.reservationType = e.reservationType;
            reservation.reservationState = e.reservationState;
            reservation.reservationStateDis = util.setRsvStateDiscription(e.reservationState);

            reservation.reservationDate = e.date;
            reservation.reservationWeekday = e.weekday;
            reservation.reservationBegTime = util.getTimeDiscription(begTime[0], begTime[1]);
            reservation.reservationEndTime = util.getTimeDiscription(endTime[0], endTime[1]);

            reservation.reservationPianoPlace = e.pianoPlace;
            reservation.reservationPianoType = e.pianoType;
            reservation.reservationPianoPrice = e.pianoPrice;

            list.push(reservation);
        }

        this.setData({
            _reservationList: list
        });
    },

    /*
     * fresh reservation info
     */
    freshInfo: function () {
        wx.showNavigationBarLoading();

        let that = this;

        let number = app.globalData._idNumber;

        wx.request({
            url: "https://958107.iterator-traits.com/alarm/all",
            data: {
                number: number
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if(res.data.success){
                    that.setReservationList(res.data.reservationList, that);
                }
                else{
                    util.alertInfo(res.data.info, "none", 1000);
                }

                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();

                console.log(that.data._reservationList);
            },
            fail: function (res) {

                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();

                util.alertInfo("预约信息查看失败，请检查网络设备是否正常。", "none", 1000);
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        wx.startPullDownRefresh();
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
        this.freshInfo();
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