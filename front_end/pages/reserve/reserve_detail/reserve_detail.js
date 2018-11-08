// pages/reserve/reserve_detail/reserve_detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _date: "",
        _pianoId: 0,

        _begTimeArray: [],
        _begTimeIndex: [],
        _endTimeArray: [],
        _endTimeIndex: [],

        _begHour: 0,
        _begMinute: 0,
        _endHour: 0,
        _endMinute: 0
    },

    // should reset end time
    shouldResetEndTime: function () {
        let should = false;
        if ((this.data._endHour < this.data._begHour) ||
            (this.data._endHour === this.data._begHour && this.data._endMinute < this.data._begMinute)) {
            should = true;
        }
        return should;
    },

    // set time TODO: some restrict
    setTimeTemplate: function (hours, minutes, currentHours, currentMinute, begHour) {
        let minuteIndex = parseInt((currentMinute - 1) / 10) + 1;

        if (minuteIndex === 6) {
            currentHours++;
            minuteIndex = 0;
        }

        if((begHour !== null && begHour > currentHours) ||
            (currentMinute === 0)){
            minuteIndex = 0;
        }

        for (let i = currentHours; i < 24; i++) {
            hours.push(i);
        }
        for(let i = minuteIndex * 10; i < 60; i += 10){
            minutes.push(i);
        }

    },

    // set begin time
    setBegTime: function (hours, minutes, begHour) {
        let date = new Date();
        let currentHours = date.getHours();
        let currentMinute = date.getMinutes();
        this.setTimeTemplate(hours, minutes, currentHours, currentMinute, begHour);
    },

    // set end time
    setEndTime: function (hours, minutes, begHour, begMinute) {
        let currentHours = this.data._begHour;
        let currentMinute = this.data._begMinute;
        this.setTimeTemplate(hours, minutes, currentHours, currentMinute, begHour);
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
        })
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
        })

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

        this.setBegTime(begHours, begMinutes, null);
        this.setData({
            _begTimeArray: [begHours, begMinutes],
            _begHour: begHours[0],
            _begMinute: begMinutes[0]
        });

        let endHours = [];
        let endMinutes = [];
        this.setEndTime(endHours, endMinutes, null);
        this.setData({
            _endTimeArray: [endHours, endMinutes],
            _endHour: endHours[0],
            _endMinute: endMinutes[0]
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