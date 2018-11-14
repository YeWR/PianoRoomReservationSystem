// pages/info/reservation/reservation_detail/reservation_detail.js

let app = getApp();
let util = app.util;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _reservationUser: "",
        _userType: "",

        _reservationId: "",

        _reservationType: "",
        _reservationState: "",


        _reservationDate: "",
        _reservationWeekday: "",
        _reservationBegTime: "",
        _reservationEndTime: "",

        _reservationPianoPlace: "",
        _reservationPianoType: "",
        _reservationPianoPrice: "",

        _reservationTypeDis: "",
        _reservationStateDis: "",

        _canvasId: "reservationDetailQr",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // init data
        this.setData({
            _reservationUser:app.globalData._username,
            _userType: app.globalData._userType,

            _reservationId: options.reservationId,

            _reservationType: options.reservationType,
            _reservationState: options.reservationState,

            _reservationDate: options.reservationDate,
            _reservationWeekday: options.reservationWeekday,
            _reservationBegTime: options.reservationBegTime,
            _reservationEndTime: options.reservationEndTime,

            _reservationPianoPlace: options.reservationPianoPlace,
            _reservationPianoType: options.reservationPianoType,
            _reservationPianoPrice: options.reservationPianoPrice,

            _reservationTypeDis: util.setUserTypeDiscription(Number(options.reservationType)),
            _reservationStateDis: options.reservationStateDis,
        });
        // draw Qr code
        util.drawQrCode(this.data._canvasId, this.data._reservationId);
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