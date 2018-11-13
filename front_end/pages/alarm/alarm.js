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
     */
    bindReserveDetail: function(e){

    },

    /*
     * to detail
     */
    toAlarmDetail: function(){

    },

    /*
     * set reservation list
     */
    setReservationList: function(reservationList, that){
        let list = [];
        let scaleHour = util.BEGINHOUR;
        let scaleMinute = util.BEGINMINUTE;
        reservationList.forEach((e) => {
            reservation = {};
            reservation.pianoPlace = e.pianoPlace;
            reservation.pianoType = e.pianoType;
            reservation.reservationStateDis = util.setRsvStateDiscription(e.reservationState);
            reservation.date = e.date;
            reservation.weekday = e.date.getDay();
            let begTime = util.getEndTime(scaleHour, scaleMinute, e.begTimeIndex);
            let endTime = util.getEndTime(scaleHour, scaleMinute, e.endTimeIndex);
            reservation.begTime = util.getTimeDiscription(begTime[0], begTime[1]);
            reservation.endTime = util.getTimeDiscription(endTime[0], endTime[1]);
        });
    },

    /*
     * init reservation information
     */
    initReserveInfo: function(){
        let that = this;
        let numberType = app.globalData._userType;
        let number;
        if(numberType === util.USERTYPE.SOCIAL){
            // phone number
            number = app.globalData._phoneNumber;
        }
        else{
            // student id number or teacher
            number = app.globalData._idNumber;
        }

        wx.request({
            url: "https://958107.iterator-traits.com/alarm/all",
            data: {
                number: number,
                numberType: numberType
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                that.setReservationList(res.data.reservationList, that);
            },
            fail: function (res) {
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