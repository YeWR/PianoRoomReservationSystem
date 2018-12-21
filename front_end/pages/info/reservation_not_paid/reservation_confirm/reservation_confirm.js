// pages/reserve/reserve_confirm/reserve_confirm.js

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
        _reservationType: "",
        _reservationTypeDiscription: "",
        _date: "",
        _begTime: "",
        _endTime: "",
        _begTimeIndex: -1,
        _endTimeIndex: -1,
        _pianoPlace: "",
        _pianoType: "",
        _pianoPrice: "",
        _pianoId: "",
        _uuid: "",
    },

    /*
     * get open id
     */
    getOpenId: function (that, code) {
        let params = {};
        params["appid"] = util.PAYAPPID;
        params["secret"] = util.PAYSECRETID;
        params["js_code"] = code;
        params["grant_type"] = "authorization_code";

        let url = util.setUrl("https://api.weixin.qq.com/sns/jscode2session", params);

        wx.request({
            url: url,
            method: 'GET',
            success: function (res) {
                that.pay(that, res.data.openid)
            },
            fail: function () {
            },
            complete: function () {
            }
        })
    },

    /*
     * pay
     */
    pay: function (that, openid) {

        let number = app.globalData._idNumber;
        if (app.globalData._userType !== util.USERTYPE.SOCIAL) {
            // stu id card
            number = app.globalData._idNumber;
        }

        wx.request({
            url: "https://958107.iterator-traits.com/user/reservation/pay",
            data: {
                openid: openid,
                uuid: that.data._uuid
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.data.success) {
                    let payModel = res.data.sign;
                    console.log("payModel: ", payModel);
                    wx.requestPayment({
                        timeStamp: payModel.timeStamp,
                        nonceStr: payModel.nonceStr,
                        package: payModel.package,
                        signType: "MD5",
                        paySign: payModel.paySign,
                        success: function (res) {
                            util.alertInfo("预约成功！", "success", 500);
                            setTimeout(() => {
                                that.toAlarm();
                            }, 500);
                        },
                        fail: function (res) {
                            util.alertInfo("支付失败", "none", 1000);
                        }
                    })
                }
                else {
                    util.alertInfo(res.data.info, "none", 1000);
                }
            },
            fail: function () {
                util.alertInfo("网络异常", "none", 1000);
            }
        });
    },


    /*
     * confirm reservation
     */

    confirmReservation: function (e) {
        let that = this;
        wx.login({
            success: function (res) {
                console.log("login: ", res);
                that.getOpenId(that, res.code)
            },
            fail: function () {
                util.alertInfo("微信登录失败", "none", 1000);
            }
        });
    },

    /*
     * cancel reservation
     */
    cancelReservation: function (e) {
        let that = this;
        wx.request({
            url: "https://958107.iterator-traits.com/user/reservation/cancel",
            data: {
                openid: openid,
                uuid: that.data._uuid
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.data.success) {
                    util.alertInfo("成功取消订单", "success", 1000);
                    setTimeout(function () {
                        that.toAlarm();
                    }, 500);
                }
                else {
                    util.alertInfo(res.data.info, "none", 1000);
                }
            },
            fail: function () {
                util.alertInfo("网络异常", "none", 1000);
            }
        });
    },

    /*
     * go out
     */
    goOut: function (e) {
        this.toAlarm();
    },

    /*
     * to alarm
     */
    toAlarm: function () {
        wx.switchTab({
            url: "../../alarm/alarm"
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

            _reservationType: options.reservationType,
            _reservationTypeDiscription: util.setReservationTypeDiscription(Number(options.reservationType)),
            _date: options.reservationDate,
            _begTime: options.reservationBegTime,
            _endTime: options.reservationEndTime,
            _begTimeIndex: options.begTimeIndex,
            _endTimeIndex: options.endTimeIndex,
            _pianoPlace: options.reservationPianoPlace,
            _pianoPrice: options.reservationPianoPrice,
            _pianoType: options.reservationPianoType,
            _pianoId: options.reservationPianoId,
            _uuid: options.reservationId
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
