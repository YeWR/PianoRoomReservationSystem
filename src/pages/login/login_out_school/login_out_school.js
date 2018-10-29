// pages/login_out_school/login_out_school.js
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

    // login
    login: function () {
        if (this.data.username.length === 0 || this.data.password.length === 0) {
            wx.showToast({
                title: '账号或密码不得为空!',
                icon: 'loading',
                duration: 1500
            });
            setTimeout(function(){
                wx.hideToast()
            },2000);
        } else {
            // 密码 记得加密
            wx.request({
                url: '',
                data: {username:this.data.username, password:this.data.password},
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }, // 设置请求的 header
                success: function(res){
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 1000
                    });
                    wx.navigateTo({
                      url: ''
                    });
                    // success
                },
                fail: function(res) {
                    // fail
                }
            });
        }
    },

    // register
    register: function () {
        wx.navigateTo({
            url: '../../register/register_out_school/register_out_school'
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