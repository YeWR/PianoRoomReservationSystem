// pages/reserve/reserve_space/reserve_space.js

let app = getApp();
let util = app.util;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _date: "",
        _pianoList: [{},{},{},{}]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    setPianoList: function (list, that) {
        let pianoList = [];
        list.forEach((e) => {
            let piano = {};
            piano._pianoId = e.id;
            piano._pianoInfo = e.info;
            pianoList.push(piano);
        });
        this.setData({
            _pianoList: pianoList
        })
    },

    // to reserve a piano
    toReservePiano:function(e) {
        let pianoId = e.currentTarget.dataset.id;
        let url = "../reserve_detail/reserve_detail?pianoId=" + pianoId;
        wx.navigateTo({
            url:url
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // get the date
        let date = util.formatDate(new Date());
        let that = this;
        this.setData({
            _date: date
        });
        // get the piano list
        // wx.request({
        //     url: "",
        //     method: "GET",
        //     header: {
        //         "Content-Type": "application/x-www-form-urlencoded"
        //     },
        //     success: function (res) {
        //         // set the piano list data
        //         setPianoList(res.pianoList, that);
        //     },
        //     fail: function (res) {
        //         util.alertInfo("获取琴房信息失败，请检查网络设备是否正常。", "none", 1000);
        //     }
        // });
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