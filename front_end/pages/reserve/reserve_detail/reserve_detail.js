// pages/reserve/reserve_detail/reserve_detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _pianoId: 0
    },

    // submit reservation
    submitReservation: function (e) {
        // TODO: check if success
        this.toAlarm(e);
    },

    // to alarm
    toAlarm:function(e){
        wx.switchTab({
          url: "../../alarm/alarm"
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            _pianoId: options.pianoId
        })
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