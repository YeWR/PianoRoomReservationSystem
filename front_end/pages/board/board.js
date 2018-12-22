// pages/board/board.js

let app = getApp();
let util = app.util;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _noticeList: [],
            _noticeListShow: [],
        _noticeLimit: 6,

        _showThis: false,
        _text: "加载中...",
    },

    /*
     * bind reservation detail
     * to detail
     */
    bindNoticeDetail: function(e){
        let id = e.currentTarget.dataset.id;
        let paras = this.data._noticeListShow[id];

        let url = util.setUrl("./board_detail/board_detail", paras);
        wx.navigateTo({
            url: url
        });
    },

    /*
     * set reservation list
     */
    setNoticeList: function(noticeList, that){
        that.setData({
            _noticeList: noticeList,
            _noticeListShow: noticeList.slice(0, that.data._noticeLimit)
        });
    },

    /*
     * fresh reservation info
     */
    freshInfo: function () {
        wx.showNavigationBarLoading();

        let that = this;

        wx.request({
            url: "https://958107.iterator-traits.com/user/notice/all",
            data: {
            },
            method: "GET",
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

                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            },
            fail: function (res) {

                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();

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
        this.setData({
            _noticeListShow: [],
            _noticeLimit: 6,

            _showThis: false,
            _text: "加载中...",
        });
        this.freshInfo();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let limit = Math.min(that.data._noticeLimit + 3, that.data._noticeList.length);
        that.setData({
            _showThis: true
        }, function () {
            if(that.data._noticeLimit >= that.data._noticeList.length){
                that.setData({
                    _text: "已经到底啦~",
                })
            }
            else {
                setTimeout(function () {
                    that.setData({
                        _noticeLimit: limit,
                        _noticeListShow: that.data._noticeList.slice(0, limit),
                        _showThis: false
                    });
                }, 500);
            }
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});