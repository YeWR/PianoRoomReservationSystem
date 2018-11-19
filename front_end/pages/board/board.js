// pages/board/board.js

let app = getApp();
let util = app.util;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _noticeList: [],
    },

    /*
     * bind reservation detail
     * to detail
     */
    bindNoticeDetail: function(e){
        let id = e.currentTarget.dataset.id;
        let paras = this.data._noticeList[id];

        let url = util.setUrl("./board_detail/board_detail", paras);
        wx.navigateTo({
            url: url
        });
    },

    /*
     * set reservation list
     */
    setNoticeList: function(noticeList, that){
        this.setData({
            _noticeList: noticeList
        });
    },

    /*
     * init reservation information
     */
    initNoticeInfo: function(){
        let that = this;

        wx.request({
            url: "https://958107.iterator-traits.com/notice/all",
            data: {
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if(res.data.success){
                    that.setNoticeList(res.data.noticeList, that);
                }
                else{
                    util.alertInfo(res.data.info, "none", 1000);
                }
            },
            fail: function (res) {
                util.alertInfo("预约信息查看失败，请检查网络设备是否正常。", "none", 1000);
            }
        });
    },

    /*
     * redirect to login
     * this is a bug in wechat, so we have to fix it.
     */
    reLogin: function(){
        wx.redirectTo({
          url: '../login/login'
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