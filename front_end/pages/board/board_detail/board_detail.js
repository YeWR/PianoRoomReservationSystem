// pages/board/board_detail/board_detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _noticeId: "",
        _noticeTitle: "",
        _noticeContent: "",
        _noticeTime: "",
        _noticeAuthor: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let that = this;

        // init data
        that.setData({
            _noticeId: options.noticeId,
            _noticeTitle: options.noticeTitle,
            _noticeContent: options.noticeContent,
            _noticeTime: options.noticeTime,
            _noticeAuthor: options.noticeAuthor,
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