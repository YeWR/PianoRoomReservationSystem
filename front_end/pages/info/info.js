// pages/info/info.js

let app = getApp();
let util = app.util;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _realName: "",
        _idNumber: "",
        _idNumberHiden: "",
    },

    /*
     * log out
     */
    bindLogout: function (e) {
        wx.clearStorageSync();
        this.toLogin();
    },

    /*
     * bind personal infomation
     */
    bindPersonalInfo: function (e) {

    },

    /*
     * bind personal msg
     */
    bindPersonalMsg: function (e) {

    },

    /*
     * bind all reservations
     */
    bindReservationAll: function (e) {

    },

    /*
     * bind illegal reservations
     */
    bindReservationIllegal: function (e) {

    },

    /*
     * bind help
     */
    bindHelp: function(e){

    },

    /*
     * to login page
     */
    toLogin: function () {
        wx.redirectTo({
            url: "../login/login"
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            _realName: app.globalData._username,
            _idNumber: app.globalData._idNumber,
            _idNumberHiden: util.shwoHidenIdNumber(app.globalData._idNumber, app.globalData._userType),
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
})