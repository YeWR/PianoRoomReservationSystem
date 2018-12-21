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
        wx.navigateTo({
            url: "./individual_info/individual_info"
        });
    },

    /*
     * bind help
     */
    bindHelp: function (e) {
        wx.navigateTo({
            url: "./help/help"
        });
    },

    /*
     * bind all reservations
     */
    bindReservationAll: function (e) {
        wx.navigateTo({
            url: "./reservation/reservation"
        });
    },

    /*
     * bind illegal reservations
     */
    bindReservationIllegal: function (e) {

    },


    /*
     * to login page
     */
    toLogin: function () {
        wx.redirectTo({
            url: "../login/login"
        });
    },

    /*
     * redirect to login
     * this is a bug in wechat, so we have to fix it.
     */
    reLogin: function(){
        wx.redirectTo({
            url: "../login/login"
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let user = app.globalData._username;
        if(!user){
            this.reLogin();
        }

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
});
