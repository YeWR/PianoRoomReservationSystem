//login.js
//获取应用实例

let app = getApp();
let util = app.util;


// 此处成员变量没有以_开头是因为这些变量都是小程序默认初始化的，如果要强行更改，麻烦...

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse("button.open-type.getUserInfo")
    },
    // 校内
    loginInSchool: function () {
        wx.navigateTo({
            url: "./login_in_school/login_in_school"
        });
    },
    // 校外
    loginOutSchool: function () {
        wx.navigateTo({
            url: "./login_out_school/login_out_school"
        })
    },

    /*
     * to board
     * after login success
     */
    /*todo*/
    toBoard: function () {
        wx.switchTab({
            url: "../info/info"
        });
    },


    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
        // if there is cookie

        let cookie = wx.getStorageSync("cookie");
        let that = this;

        if (cookie) {
            let info = true;
            wx.request({
                url: "https://958107.iterator-traits.com/user/cookie",
                data: {
                    token: cookie
                },
                method: "GET",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                success: function (res) {
                    // if success
                    if (res.data.success) {

                        util.alertInfo("欢迎回来", "success", 500);

                        app.globalData._username = res.data.realName;
                        app.globalData._userType = res.data.userType;
                        app.globalData._idNumber = res.data.idNumber;

                        setTimeout(() => {
                            that.toBoard();
                        }, 500);
                    }
                    // if wrong
                    else {
                        util.alertInfo(res.data.info, "none", 1000);
                    }
                },
                fail: function (res) {
                    // fail
                    util.alertInfo("自动登录失败，请检查您的网络设备是否连接正常", "none", 1000);
                }
            });
        }
    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
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
});

