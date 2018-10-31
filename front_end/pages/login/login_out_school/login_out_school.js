// pages/login_out_school/login_out_school.js

let app = getApp();
let util = app.util;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: '',
        password: ''
    },

    // get username
    getUsername: function (e) {
        this.setData({
            username: e.detail.value
        });
    },

    // get password
    getPassword: function (e) {
        this.setData({
            password: e.detail.value
        });
    },

    /*******************************************************************************************************
     * TODO:密码加密
     * check if any info is empty
     * send register POST
     *******************************************************************************************************/

    // login
    login: function () {
        let that = this;

        // not empty check
        // TODO: add info in the checks
        let notEmptyCheck = function () {
            let ans = true;
            if (!that.data.username) {
                ans = false;
                util.alertInfo('用户名不能为空', 'none', 1000);
            }
            else if (!that.data.password) {
                ans = false;
                util.alertInfo('密码不能为空', 'none', 1000);
            }
            return ans;
        };

        // register POST
        let post = function () {
            wx.request({
                url: '',
                data: {
                    username: that.data.username,
                    password: that.data.password,
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    util.alertInfo('成功', 'success', 1000);
                    wx.navigateTo({
                        url: ''
                    });
                    // success
                },
                fail: function (res) {
                    // fail
                }
            });
        };

        // check
        if (notEmptyCheck()) {
            // TODO：暂时跳转到index界面
            // post();
            that.toIndex();
        }

    },

    // to register
    toRegister: function () {
        wx.navigateTo({
            url: '../../register/register_out_school/register_out_school'
        });
    },

    // to index
    toIndex:function(){
        wx.navigateTo({
            url: '../../index/index'
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
})