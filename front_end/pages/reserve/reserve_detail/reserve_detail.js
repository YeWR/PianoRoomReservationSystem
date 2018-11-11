// pages/reserve/reserve_detail/reserve_detail.js

let app = getApp();
let util = app.util;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _date: "",
        _pianoId: 0,
        _timeTable: [],
        _pianoPrices: [],
        _pianoInfo: "",

        _begTimeArray: [],
        _begTimeIndex: [],
        _endTimeArray: [],
        _endTimeIndex: [],

        _begHour: 0,
        _begMinute: 0,
        _endHour: 0,
        _endMinute: 0,
        _lastHour: util.ENDHOUR,
        _lastMinute: util.ENDMINUTE
    },

    // should reset end time
    shouldResetEndTime: function () {
        let should = false;
        if ((this.data._endHour < this.data._begHour) ||
            (this.data._endHour === this.data._begHour && this.data._endMinute < this.data._begMinute)) {
            should = true;
        }
        else if (
            (this.data._endHour > this.data._lastHour) ||
            (this.data._endHour === this.data._lastHour && this.data._endMinute > this.data._lastMinute)) {
            should = true;
        }
        return should;
    },

    // set begin time
    setBegTime: function (hours, minutes, selectedHour) {
        let date = new Date();
        let currentHours = date.getHours();
        let currentMinute = date.getMinutes();
        this.setData({
            _lastHour: util.ENDHOUR,
            _lastMinute: util.ENDMINUTE
        });
        util.setTimeTemplate(hours, minutes, currentHours, currentMinute, this.data._lastHour, this.data._lastMinute, selectedHour);
    },

    // set end time
    setEndTime: function (hours, minutes, selectedHour) {
        let currentHours = this.data._begHour;
        let currentMinute = this.data._begMinute;
        let lastTime = util.getNearestEndTime(this.data._begHour, this.data._begMinute, this.data._timeTable);
        this.setData({
            _lastHour: lastTime[0],
            _lastMinute: lastTime[1]
        });
        util.setTimeTemplate(hours, minutes, currentHours, currentMinute, this.data._lastHour, this.data._lastMinute, selectedHour);
    },

    // submit reservation
    submitReservation: function (e) {
        // TODO: check if success
        this.toAlarm(e);
    },

    // to alarm
    toAlarm: function (e) {
        wx.switchTab({
            url: "../../alarm/alarm"
        });
    },

    /*
     * bind begin time change
     * only when user change the value of begin time
     * TODO: remember to restrict the time array if some rooms are busy.
     */
    bindBegTimeChange: function (e) {
        let begTimeArray = this.data._begTimeArray;
        let column = e.detail.column;
        let value = e.detail.value;

        let hours = [];
        let minutes = [];

        // change hour
        if (column === 0) {
            const begHour = begTimeArray[column][value];
            this.setBegTime(hours, minutes, begHour);
            this.setData({
                _begTimeArray: [hours, minutes],
                _begHour: begHour,
                _begMinute: minutes[0]
            });
        }
        // change minute
        else {
            this.setData({
                _begMinute: begTimeArray[column][value]
            });
        }

        // reset the end time range
        let endHours = [];
        let endMinutes = [];
        this.setEndTime(endHours, endMinutes, this.data._endHour);
        this.setData({
            _endTimeArray: [endHours, endMinutes]
        });
        // reset end time
        if (this.shouldResetEndTime()) {
            this.setData({
                _endHour: this.data._begHour,
                _endMinute: this.data._begMinute
            });
        }
        // reset the index
        let hourIndex = endHours.indexOf(this.data._endHour);
        let minuteIndex = endMinutes.indexOf(this.data._endMinute);
        this.setData({
            _endTimeIndex: [hourIndex, minuteIndex]
        });
    },

    /*
     * bind end time change
     * only when user change the value of end time
     * TODO: remember to restrict the time array if some rooms are busy.
     */
    bindEndTimeChange: function (e) {
        let endTimeArray = this.data._endTimeArray;
        let column = e.detail.column;
        let value = e.detail.value;

        let hours = [];
        let minutes = [];

        // change hour
        if (column === 0) {
            let endHour = endTimeArray[column][value];
            this.setEndTime(hours, minutes, endHour);
            this.setData({
                _endTimeArray: [hours, minutes],
                _endHour: endHour,
                _endMinute: minutes[0]
            });
        }
        // change minute
        else {
            this.setData({
                _endMinute: endTimeArray[column][value]
            });
        }
    },

    /* init time
     * begin time -> current time
     * end time -> current time
     */
    initTime: function () {
        let begHours = [];
        let begMinutes = [];

        let date = new Date();
        let currentHours = date.getHours();
        let currentMinute = date.getMinutes();
        util.setTimeTemplate(begHours, begMinutes, currentHours, currentMinute, this.data._lastHour, this.data._lastMinute, currentHours);

        this.setData({
            _begTimeArray: [begHours, begMinutes],
            _begHour: begHours[0],
            _begMinute: begMinutes[0]
        });

        let endHours = [];
        let endMinutes = [];
        this.setEndTime(endHours, endMinutes, begHours[0]);
        this.setData({
            _endTimeArray: [endHours, endMinutes],
            _endHour: endHours[0],
            _endMinute: endMinutes[0]
        });
    },

    /*
     * post
     * get the info needed
     */
    initInfo: function () {
        let that = this;
        wx.request({
            url: "https://958107.iterator-traits.com/reserve/detail",
            data: {
                pianoId: that._pianoId,
                date: that._date
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                that.setInfo(res, that);
            },
            fail: function (res) {
                util.alertInfo("获取琴房信息失败，请检查网络设备是否正常。", "none", 1000);
            }
        });
    },

    // setInfo
    setInfo: function (dict, that) {
        that.setData({
            _timeTable: dict.timeTable,
            _pianoPrices: dict.pianoPrices,
            _pianoInfo: dict.pianoInfo
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            _date: options.date,
            _pianoId: options.pianoId
        });
        // init piano infos
        this.initInfo();
        // init time array
        this.initTime();
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