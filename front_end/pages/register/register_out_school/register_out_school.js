// pages/register_out_school/register_out_school.js

let app = getApp();
let util = app.util;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: '',
        password: '',
        rePassword: '',
        realName: '',
        idNumber: '',
        // agreement: {name: 'agreement', value: '我已阅读并同意《注册协议》', checked: true},
    },

    /*******************************************************************************************************
     * get data of the user
     *******************************************************************************************************/
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

    // get re password
    reGetPassword: function (e) {
        this.setData({
            rePassword: e.detail.value
        });
    },

    // get real name
    getRealName: function (e) {
        this.setData({
            realName: e.detail.value
        });
    },

    // get the id number(身份证)
    getIdNumber: function (e) {
        this.setData({
            idNumber: e.detail.value
        });
    },

    // get the agreement
    // getAgreement:function(e){
    //     this.setData({
    //         agreement: e.detail.value
    //     });
    // },

    /*******************************************************************************************************
     * TODO:密码加密
     * check if any info is empty
     * check if info format if valid
     * check if agreement is checked
     * send register POST
     *******************************************************************************************************/

    // register
    register: function (e) {
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
                util.alertInfo('密码不嫩为空', 'none', 1000);
            }
            else if (!that.data.rePassword) {
                ans = false;
                util.alertInfo('密码不能为空', 'none', 1000);
            }
            else if (!that.data.realName) {
                ans = false;
                util.alertInfo('真实姓名不能为空', 'none', 1000);
            }
            else if (!that.data.idNumber) {
                ans = false;
                util.alertInfo('身份证号不能为空', 'none', 1000);
            }
            return ans;
        };

        // format check
        let formatCheck = function () {
            let valid = true;
            // TODO: set the format of register
            if (that.data.username.length > 15 || that.data.username.password !== that.data.username.rePassword) {
                valid = false
            }
            return valid;
        };

        // agreement check
        // let agreementCheck = function () {
        //     console.log(that.data.agreement);
        //     return that.data.agreement.checked;
        // };

        // register POST
        let post = function () {
            wx.request({
                url: '',
                data: {
                    username: that.data.username,
                    password: that.data.password,
                    realName: that.data.realName,
                    idNumber: that.data.idNumber
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
        if (notEmptyCheck()
            && formatCheck()
        //    && agreementCheck()
        ) {
            // TODO：暂时跳转到login界面
            // post();
            that.toLogin(e);
        }

    },

    // go to login
    toLogin:function(e){
        wx.navigateTo({
            url: '../../login/login_out_school/login_out_school'
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

