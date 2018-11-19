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
            _noticeId: options.noticeId
        });

        // get data from server
        wx.request({
            url: "https://958107.iterator-traits.com/notice/all",
            data: {
                noticeId: that.data._noticeId
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if(res.data.success){
                    let notice = res.data.notice;
                    that.setData({
                        _noticeTitle: notice.noticeTitle,
                        _noticeContent: notice.noticeContent,
                        _noticeTime: notice.noticeTime,
                        _noticeAuthor: notice.noticeAuthor,
                    });
                }
                else{
                    util.alertInfo(res.data.info, "none", 1000);
                }
            },
            fail: function (res) {
                util.alertInfo("公告信息查看失败，请检查网络设备是否正常。", "none", 1000);
            }
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