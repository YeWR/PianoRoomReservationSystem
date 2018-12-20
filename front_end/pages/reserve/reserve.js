// pages/reserve/reserve_space/reserve.js

let app = getApp();
let util = app.util;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _jsDate: "",
        _date: "",
        _pianoList: [],
        _pianoAvailable: [],
        _pianoAvailableShow: [],
        _pianoIsAvailable: false,
        _pianoLimit: 4,

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

        _cannotPrevious: true,
        _cannotNext: false,

        _canvasId: "timeTabelBar",

        _showThis: false,
        _text: "加载中...",
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

        if (util.dateSub(this.data._jsDate, curDate) > 0) {
            currentHours = util.BEGINHOUR;
            currentMinute = util.BEGINMINUTE;
        }
        util.setTimeTemplate(hours, minutes, currentHours, currentMinute, this.data._lastHour, this.data._lastMinute, selectedHour);
    },

    /*
     * set end time
     */
    setEndTime: function (hours, minutes, selectedHour) {

        let currentHours = this.data._begHour;
        let currentMinute = this.data._begMinute;
        util.setTimeTemplate(hours, minutes, currentHours, currentMinute, this.data._lastHour, this.data._lastMinute, selectedHour);
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

        this.setPianoAvailable(this);
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

        this.setPianoAvailable(this);
    },

    /*
     * set the preious and next day validation
     * [begDay, endDay]
     */
    setPreNextDay: function (begDay, endDay) {
        if (util.dateSub(this.data._jsDate, begDay) > 0) {
            this.setData({
                _cannotPrevious: false
            })
        }
        else {
            this.setData({
                _cannotPrevious: true
            })
        }

        if (util.dateSub(this.data._jsDate, endDay) < 0) {
            this.setData({
                _cannotNext: false
            });
        }
        else {
            this.setData({
                _cannotNext: true
            })
        }
    },

    /*
     * judge whether the piano is available
     * begIndex and endIndex
     */
    isAvailable: function (timeTable, that) {

        const begIndex = util.getIndexInTimeTable(that.data._begHour, that.data._begMinute);
        const endIndex = util.getIndexInTimeTable(that.data._endHour, that.data._endMinute);
        let avaliable = false;

        for (let i = begIndex; i < endIndex; ++i) {
            if (timeTable[i] === 0) {
                avaliable = true;
                break;
            }
        }

        return avaliable;
    },

    /*
     * set piano list available+-----------
     */
    setPianoAvailable: function (that) {
        const tableLen = util.getTimeTableLen();
        let pianoAvailable = [];
        let pianoIsAvailable = false;
        let curDate = new Date();
        let day = util.dateSub(that.data._jsDate, curDate);

        for (let piano of that.data._pianoList) {
            let timeTable = piano.timeTable.slice(tableLen * day, tableLen * (day + 1));
            if (that.isAvailable(timeTable, that)) {
                let pianoAvl = {};
                pianoAvl.pianoPlace = piano.pianoPlace;
                pianoAvl.pianoId = piano.pianoId;
                pianoAvl.pianoType = piano.pianoType;
                pianoAvl.timeTable = timeTable.slice();

                pianoAvailable.push(pianoAvl);
                pianoIsAvailable = true;
            }
        }
        that.setData({
            _pianoAvailable: pianoAvailable,
            _pianoAvailableShow: pianoAvailable.slice(0, that.data._pianoLimit),
            _pianoIsAvailable: pianoIsAvailable
        }, function () {
            util.drawTimeTable(that, pianoAvailable, "piano", that.data._jsDate);
        });
    },

    /*
     * bind choose previous day
     */
    bindChoosePreviousDay: function (e) {
        let curDate = new Date();
        let lastDate = new Date();
        lastDate.setDate(lastDate.getDate() + util.DATELEN);

        if (util.dateSub(this.data._jsDate, curDate) > 0 &&
            util.dateSub(this.data._jsDate, lastDate) <= 0) {

            let date = this.data._jsDate;
            date.setDate(date.getDate() - 1);
            this.setData({
                _jsDate: date,
                _date: util.formatDate(date)
            });
        }

        this.setPreNextDay(curDate, lastDate);
        this.initTime();
        this.setPianoAvailable(this);
    },

    /*
     * bind choose next day
     */
    bindChooseNextDay: function (e) {

        let curDate = new Date();
        let lastDate = new Date();
        lastDate.setDate(lastDate.getDate() + util.DATELEN);

        if (util.dateSub(this.data._jsDate, lastDate) < 0 &&
            util.dateSub(this.data._jsDate, curDate) >= 0) {

            let date = this.data._jsDate;
            date.setDate(date.getDate() + 1);
            this.setData({
                _jsDate: date,
                _date: util.formatDate(date)
            });
        }

        this.setPreNextDay(curDate, lastDate);
        this.initTime();
        this.setPianoAvailable(this);
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

        if (util.dateSub(this.data._jsDate, curDate) > 0) {
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
            _endHour: util.ENDHOUR,
            _endMinute: util.ENDMINUTE
        });

        // reset the index
        let hourIndex = endHours.indexOf(this.data._endHour);
        let minuteIndex = endMinutes.indexOf(this.data._endMinute);
        this.setData({
            _endTimeIndex: [hourIndex, minuteIndex]
        });
    },

    /*
     * init data
     */
    initData: function (that) {
        that.setData({
            _pianoList: [],
            _pianoAvailable: [],
            _pianoAvailableShow: [],

            _begTimeArray: [],
            _begTimeIndex: [],
            _endTimeArray: [],
            _endTimeIndex: [],

            _cannotNext: false,
            _cannotPrevious: true,
        });
    },

    /*
     * redirect to login
     * this is a bug in wechat, so we have to fix it.
     */
    reLogin: function () {
        wx.redirectTo({
            url: "../login/login"
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let user = app.globalData._username;
        if (!user) {
            this.reLogin();
        }
    },

    setPianoList: function (list, that) {
        // set the piano Available
        that.setData({
            _pianoList: list
        }, function () {
            that.setPianoAvailable(that)
        });
    },

    /*
     * to reserve a piano
     */
    toReservePiano: function (e) {
        let paras = {};
        let id = e.currentTarget.dataset.id;
        console.log(id);

        paras["pianoId"] = this.data._pianoAvailableShow[id].pianoId;
        paras["pianoPlace"] = this.data._pianoAvailableShow[id].pianoPlace;
        paras["pianoType"] = this.data._pianoAvailableShow[id].pianoType;
        paras["date"] = this.data._date;
        paras["jsDate"] = this.data._jsDate;

        let url = util.setUrl("./reserve_detail/reserve_detail", paras);
        wx.navigateTo({
            url: url
        });
    },

    /*
     * fresh reservation info
     */
    freshInfo: function () {
        wx.showNavigationBarLoading();

        // get the date
        let date = new Date();
        if (this.data._jsDate !== "") {
            date = this.data._jsDate;
        }
        let that = this;

        that.setData({
            _jsDate: date,
            _date: util.formatDate(date),
        });

        // init data
        that.initData(that);

        // set previous next avail
        let curDate = new Date();
        let lastDate = new Date();
        lastDate.setDate(lastDate.getDate() + util.DATELEN);
        that.setPreNextDay(curDate, lastDate);

        // init time array
        that.initTime();

        // get the piano list
        wx.request({
            url: "https://958107.iterator-traits.com/user/piano/all",
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.data.success) {
                    // set the piano list data
                    that.setPianoList(res.data.pianoList, that);
                }
                else {
                    util.alertInfo(res.data.info, "none", 1000);
                }
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            },
            fail: function (res) {

                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();

                util.alertInfo("获取琴房信息失败，请检查网络设备是否正常。", "none", 1000);
            }
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
        wx.startPullDownRefresh();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.initData(this);
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
        this.setData({
            _pianoAvailableShow: [],
            _pianoLimit: 4,

            _showThis: false,
            _text: "加载中...",
        });
        this.freshInfo();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let limit = Math.min(that.data._pianoLimit + 3, that.data._pianoAvailable.length);
        that.setData({
            _showThis: true
        }, function () {
            if(that.data._pianoLimit >= that.data._pianoAvailable.length){
                that.setData({
                    _text: "已经到底啦~",
                })
            }
            else {
                setTimeout(function () {
                    that.setData({
                        _pianoLimit: limit,
                        _pianoAvailableShow: that.data._pianoAvailable.slice(0, limit),
                        _showThis: false
                    });
                }, 500);
            }
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});
