// pages/register_out_school/register_out_school.js

let app = getApp();
let util = app.util;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _phoneNumber: "",
        _validateCode: "",
        _realName: "",
        _idNumber: "",

        _disable: true,
        _validateCodeTitle: "获取验证码",
        _timeLeft: 60,
        _intervalIndex: -1,
    },

    /*******************************************************************************************************
     * get data of the user
     *******************************************************************************************************/

    /*
     * bind phone number
     */
    bindPhoneNumber: function (e) {
        let phoneNumber = e.detail.value;
        if (util.checkPhoneNumber(phoneNumber)) {
            this.setData({
                _disable: false,
                _phoneNumber: phoneNumber
            });
        }
        else {
            this.setData({
                _disable: true
            });
        }
    },

    /*
     * bind validation code
     */
    bindValidateCode: function (e) {
        this.setData({
            _validateCode: e.detail.value
        });
    },

    /*
     * bind real name
     */
    bindRealName: function (e) {
        this.setData({
            _realName: e.detail.value
        });
    },

    /*
     * bind the id number(身份证)
     */
    bindIdNumber: function (e) {
        this.setData({
            _idNumber: e.detail.value
        });
    },

    /*
     * get validation code
     */
    getValidateCode: function (e) {
        if (util.checkPhoneNumber(this.data._phoneNumber)) {
            util.getValidateCode(this.data._phoneNumber, 0);

            // count down 60s
            let that = this;
            let countDown = () => {
                let timeLeft = that.data._timeLeft;
                timeLeft--;
                that.setData({
                    _disable: true,
                    _timeLeft: timeLeft,
                    _validateCodeTitle: timeLeft + "秒发送"
                });

                if (timeLeft <= 0) {
                    clearInterval(that.data._intervalIndex);
                    that.setData({
                        _disable: false,
                        _timeLeft: 60,
                        _validateCodeTitle: "获取验证码"
                    });
                }
            };
            let interval = 1000;
            let index = setInterval(countDown, interval);
            that.setData({
                _intervalIndex: index
            });
        }
        else {
            util.alertInfo("手机号码格式不正确", "none", 1000);
            this.setData({
                _disable: false
            });
        }
    },

    /*
     * to log in
     */
    toLogin: function(e){
        wx.navigateBack({
            delta: 1
        });
    },

    /*
     * register
     */
    register: function (e) {
        let that = this;

        // not empty check
        let notEmptyCheck = function () {
            let ans = true;
            if (!util.checkPhoneNumber(that.data._phoneNumber)) {
                ans = false;
                util.alertInfo("手机号码为空或格式不正确", "none", 1000);
            }
            else if (!that.data._validateCode) {
                ans = false;
                util.alertInfo("验证码不能为空", "none", 1000);
            }
            else if (!util.checkRealName(that.data._realName)) {
                ans = false;
                util.alertInfo("请输入正确的姓名", "none", 1000);
            }
            else if (!util.checkIdNumber(that.data._idNumber)) {
                ans = false;
                util.alertInfo("请输入正确的身份证号", "none", 1000);
            }
            return ans;
        };

        // register POST
        let post = function () {
            wx.request({
                url: "https://958107.iterator-traits.com/user/registration",
                data: {
                    phoneNumber: that.data._phoneNumber,
                    validateCode: that.data._validateCode,
                    realName: that.data._realName,
                    idNumber: util.md5(that.data._idNumber)
                },
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    // if success
                    console.log("res:", res);
                    if (res.data.success) {
                        util.alertInfo("注册成功", "success", 1000);
                        app.globalData._username = that.data._realName;
                        app.globalData._userType = util.USERTYPE.SOCIAL;
                        app.globalData._idNumber = that.data._phoneNumber;
                        that.toBoard();
                    }
                    // if wrong
                    else {
                        util.alertInfo(res.data.info, "none", 1000);
                    }
                },
                fail: function (res) {
                    util.alertInfo("注册失败，请检查您的网络设备是否连接正常", "none", 1000);
                }
            });
        };

        // check
        if (notEmptyCheck()) {
            post();
        }

    },

    /*
     * go to board
     */
    toBoard: function () {
        wx.switchTab({
            url: "../../board/board"
        });
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

