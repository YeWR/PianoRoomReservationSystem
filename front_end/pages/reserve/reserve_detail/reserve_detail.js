// pages/reserve/reserve_detail/reserve_detail.js

let app = getApp();
let util = app.util;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _jsDate: "",
        _date: "",
        _pianoId: 0,
        _timeTable: [],
        _pianoPrices: [],
        _pianoPlace: "",
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
        _lastMinute: util.ENDMINUTE,

        _chooseSingle: true,
        _userType: null,
    },

    /*
     * should reset end time
     */
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

    /*
     * set begin time
     */
    setBegTime: function (hours, minutes, selectedHour) {

        let curDate = new Date();
        let currentHours = Math.max(Math.min(curDate.getHours(), util.ENDHOUR), util.BEGINHOUR);
        let currentMinute = curDate.getMinutes();

        if (currentHours === util.BEGINHOUR) {
            currentMinute = util.BEGINMINUTE;
        }
        else if (currentHours === util.ENDHOUR) {
            currentMinute = util.ENDMINUTE;
        }

        if (util.dateCompare(this.data._jsDate, curDate) > 0) {
            currentHours = util.BEGINHOUR;
            currentMinute = util.BEGINMINUTE;
        }

        this.setData({
            _lastHour: util.ENDHOUR,
            _lastMinute: util.ENDMINUTE
        });

        util.setTimeTemplate(hours, minutes, currentHours, currentMinute, this.data._lastHour, this.data._lastMinute, selectedHour);
    },

    /*
     * set end time
     */
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

    /*
     * submit reservation
     * to confirm
     */
    submitReservation: function (e) {
        this.toConfirm(e);
    },

    /*
     * to confirm
     */
    toConfirm: function (e) {
        let paras = {};

        paras["realName"] = app.globalData._username;
        paras["idNumber"] = app.globalData._idNumber;
        paras["userType"] = this.data._userType;
        paras["date"] = this.data._date;
        paras["begTime"] = this.data._begHour + ":" + this.data._begMinute;
        paras["endTime"] = this.data._endHour + ":" + this.data._endMinute;
        paras["begTimeIndex"] = util.getIndexInTimeTable(this.data._begHour, this.data._begMinute);
        paras["endTimeIndex"] = util.getIndexInTimeTable(this.data._endHour, this.data._endMinute);
        paras["pianoPlace"] = this.data._pianoPlace;
        // TODO: price should be determined by the settings of userType
        // paras["pianoPrice"] = this.data._pianoPrices;
        paras["pianoPrice"] = 10;

        let url = util.setUrl("../reserve_confirm/reserve_confirm", paras);
        wx.navigateTo({
            url: url
        });
    },

    /*
     * bind begin time change
     * only when user change the value of begin time
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

    /*
     * bind choose single user
     */
    bindSingleUser: function(e){
        this.setData({
            _chooseSingle: true,
            _userType: app.globalData._userType
        });
    },

    /*
     * bind choose multi users
     */
    bindMultiUsers: function(e){
        this.setData({
            _chooseSingle: false,
            _userType: util.USERTYPE.MULTI
        });
    },

    /* init time
     * begin time -> current time
     * end time -> current time
     */
    initTime: function () {
        let curDate = new Date();
        let begHours = [];
        let begMinutes = [];

        let currentHours = Math.max(Math.min(curDate.getHours(), util.ENDHOUR), util.BEGINHOUR);
        let currentMinute = curDate.getMinutes();

        if (currentHours === util.BEGINHOUR) {
            currentMinute = util.BEGINMINUTE;
        }
        else if (currentHours === util.ENDHOUR) {
            currentMinute = util.ENDMINUTE;
        }

        if (util.dateCompare(this.data._jsDate, curDate) > 0) {
            currentHours = util.BEGINHOUR;
            currentMinute = util.BEGINMINUTE;
        }

        util.setTimeTemplate(begHours, begMinutes, currentHours, currentMinute, this.data._lastHour, this.data._lastMinute, currentHours);

        this.setData({
            _begTimeArray: [begHours, begMinutes],
            _begHour: begHours[0],
            _begMinute: begMinutes[0]
        });

        let endHours = [];
        let endMinutes = [];
        this.setEndTime(endHours, endMinutes, this.data._lastHour);
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
        // wx.request({
        //     url: "https://958107.iterator-traits.com/reserve/detail",
        //     data: {
        //         pianoId: that._pianoId,
        //         date: that._date
        //     },
        //     method: "POST",
        //     header: {
        //         "Content-Type": "application/x-www-form-urlencoded"
        //     },
        //     success: function (res) {
        //         that.setInfo(res, that);
        //     },
        //     fail: function (res) {
        //         util.alertInfo("获取琴房信息失败，请检查网络设备是否正常。", "none", 1000);
        //     }
        // });
        that.setInfo(null, that);
    },

    /*
     * setInfo
     */
    setInfo: function (dict, that) {
        let timeTable = [];
        for (let i = 0; i < 84; ++i){
            timeTable.push(0);
        }
        that.setData({
            _timeTable: timeTable,//dict.timeTable,
            _pianoPrices: 1,//dict.pianoPrices,
            _pianoInfo: "gg"//dict.pianoInfo
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            _jsDate: new Date(options.jsDate),
            _date: options.date,
            _pianoId: options.pianoId,
            _pianoPlace: options.pianoPlace,
            _userType: app.globalData._userType
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