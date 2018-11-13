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
        _reservationType: null,
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
    setBegTime: function (selectedHour) {

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

        let currentTimeIndex = util.getIndexInTimeTable(currentHours, currentMinute);
        let hours = util.getHoursAvailable(currentTimeIndex, this.data._timeTable).slice();
        let minutes = util.getMinutesAvailable(this.data._begHour, currentTimeIndex, this.data._timeTable).slice();
        return [hours, minutes];
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
        let begTimeIndex = util.getIndexInTimeTable(this.data._begHour, this.data._begMinute);
        let endTimeIndex = util.getIndexInTimeTable(this.data._endHour, this.data._endMinute);
        if (endTimeIndex - begTimeIndex < util.MINTIMEINTERVAL) {
            util.alertInfo("预约时长不可小于" + util.MINTIMEINTERVAL * util.TIMEINTERVAL + "min", "none", 1000);
        }
        else {
            this.toConfirm(e);
        }
    },

    /*
     * to confirm
     */
    toConfirm: function (e) {
        let paras = {};

        paras["reservationType"] = this.data._reservationType;
        paras["date"] = this.data._date;

        paras["begTime"] = util.getTimeDiscription(this.data._begHour, this.data._begMinute);
        paras["endTime"] = util.getTimeDiscription(this.data._endHour, this.data._endMinute);

        paras["begTimeIndex"] = util.getIndexInTimeTable(this.data._begHour, this.data._begMinute);
        paras["endTimeIndex"] = util.getIndexInTimeTable(this.data._endHour, this.data._endMinute);

        paras["pianoPlace"] = this.data._pianoPlace;
        paras["pianoId"] = this.data._pianoId;
        // TODO: price should be determined by the settings of reserveType
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
            this.setData({
                _begHour: begHour
            });
            let time = this.setBegTime(begHour);
            hours = time[0];
            minutes = time[1];
            this.setData({
                _begTimeArray: [hours, minutes],
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
    bindSingleUser: function (e) {
        this.setData({
            _chooseSingle: true,
            _reservationType: app.globalData._userType
        });
    },

    /*
     * bind choose multi users
     */
    bindMultiUsers: function (e) {
        this.setData({
            _chooseSingle: false,
            _reservationType: util.USERTYPE.MULTI
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

        let currentTimeIndex = util.getIndexInTimeTable(currentHours, currentMinute);
        begHours = util.getHoursAvailable(currentTimeIndex, this.data._timeTable);
        begMinutes = util.getMinutesAvailable(begHours[0], currentTimeIndex, this.data._timeTable);

        this.setData({
            _begTimeArray: [begHours, begMinutes],
            _begHour: begHours[0],
            _begMinute: begMinutes[0]
        });

        let endHours = [];
        let endMinutes = [];
        this.setEndTime(endHours, endMinutes, this.data._begHour);
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
                pianoId: that.data._pianoId,
                date: that.data._date
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                that.setInfo(res.data, that);

                // init time array
                that.initTime();

            },
            fail: function (res) {
                util.alertInfo("获取琴房信息失败，请检查网络设备是否正常。", "none", 1000);
            }
        });

    },

    /*
     * setInfo
     */
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
            _jsDate: new Date(options.jsDate),
            _date: options.date,
            _pianoId: options.pianoId,
            _pianoPlace: options.pianoPlace,
            _reservationType: app.globalData._userType
        });
        // init piano infos
        this.initInfo();
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