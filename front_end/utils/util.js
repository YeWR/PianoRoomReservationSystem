/*******************************************************************************************************
 * common functions defined here
 *******************************************************************************************************/

const BEGINHOUR = 8;
const BEGINMINUTE = 0;
const ENDHOUR = 22;
const ENDMINUTE = 0;
// interval -> 10 => 8:00 8:10 8:20...
const TIMEINTERVAL = 10;

const formatNumber = (n) => {
    n = n.toString();
    return n[1] ? n : '0' + n
};

const formatTime = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatDate = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return [year, month, day].map(formatNumber).join('-');
};

// alert an info
const alertInfo = (title, icon, duration) => {
    wx.showToast({
        title: title,
        icon: icon,
        duration: duration
    });
};

// add some paras to url;
// @paras is dict
const setUrl = (rawUrl, paras) => {
    let url = rawUrl + "?";
    let flag = 0;
    for (let key in paras) {
        if (flag) {
            url += "&";
        }
        else {
            flag = 1;
        }
        url = url + key + "=" + paras[key];
    }
    return url;
};

/*
 * encryption of a string
 */
const md5 = (string) => {
    let rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };

    let addUnsigned = function (lX, lY) {
        let lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    let F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    };

    let G = function (x, y, z) {
        return (x & z) | (y & (~z));
    };

    let H = function (x, y, z) {
        return (x ^ y ^ z);
    };

    let I = function (x, y, z) {
        return (y ^ (x | (~z)));
    };

    let FF = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    let GG = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    let HH = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    let II = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    let convertToWordArray = function (string) {
        let lWordCount;
        let lMessageLength = string.length;
        let lNumberOfWordsTempOne = lMessageLength + 8;
        let lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
        let lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
        let lWordArray = Array(lNumberOfWords - 1);
        let lBytePosition = 0;
        let lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    let wordToHex = function (lValue) {
        let WordToHexValue = "",
            WordToHexValueTemp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValueTemp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
        }
        return WordToHexValue;
    };

    let uTF8Encode = function (string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        let output = "";
        for (let n = 0; n < string.length; n++) {
            let c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };

    let x = Array();
    let k, AA, BB, CC, DD, a, b, c, d;
    let S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    let S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    let S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    let S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
    string = uTF8Encode(string);
    x = convertToWordArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    let tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return tempValue.toLowerCase();
};

/*
 * get the index when given the hour and the time
 */
const getIndexInTimeTable = (hour, minute) => {
    let index = (hour - BEGINHOUR) * parseInt(60 / TIMEINTERVAL);
    index = index + parseInt((minute - BEGINMINUTE) / TIMEINTERVAL);
    return index;
};

/*
 * get the len of time table
 */
const getTimeTableLen = () => {
    let beg = getIndexInTimeTable(BEGINHOUR, BEGINMINUTE);
    let end = getIndexInTimeTable(ENDHOUR, ENDMINUTE);
    return end - beg;
};

/*
 * get the hour and minute given the begin time and the interval
 */
const getEndTime = (begHour, begMinute, interval) => {
    let hour = parseInt(interval / 6);
    let minute = (interval % 6) * 10;
    let endHour = begHour + hour;
    let endMinute = begMinute + minute;
    return [endHour, endMinute]
};

/*
 * get the nearest time from begin time given the restraint time table(6 x 14)
 * map from the time to the index in time string
 * eg: begin time : 8:00 -> 0; 8:10 -> 1 ... ;
 * time interval: end time - beg time
 * eg: end time = 8:50 and beg time = 8:00 -> interval = 5 means [8:00, 8:50]
 */
const getNearestEndTime = (begHour, begMinute, timeTable) => {
    let tableLen = getTimeTableLen();
    if (timeTable === null || timeTable.length !== tableLen) {
        console.log("timeTable error.");
        return null;
    }

    let begIndex = getIndexInTimeTable(begHour, begMinute);
    let interval = 0;
    for (let i = begIndex; i < tableLen; ++i) {
        // is free
        if (timeTable[i] === 0) {
            interval++;
        }
    }
    return getEndTime(begHour, begMinute, interval);
};

/*
 * set time template
 * return the hours and minutes in selective tools
 * currentHours and currentMinute -> the first time you choose
 * lastHour and lastMinute -> the last time you choose
 * selectHour -> what you choose in the tools
 */
const setTimeTemplate = (hours, minutes, currentHours, currentMinute, lastHour, lastMinute, selectedHour) => {
    let minuteIndex;
    if (currentMinute === 0) {
        minuteIndex = 0;
    }
    else {
        minuteIndex = parseInt((currentMinute - 1) / 10) + 1;
    }

    let firstHour = currentHours;
    let firstMinute = currentMinute;

    if (minuteIndex === 6) {
        firstHour++;
        firstMinute = 0;
    }
    else {
        firstMinute = minuteIndex * 10;
    }

    for (let i = firstHour; i <= lastHour; i++) {
        hours.push(i);
    }

    // 15:10 - 15:40
    if (firstHour === lastHour) {
        for (let i = firstMinute; i <= lastMinute; i += 10) {
            minutes.push(i);
        }
    }
    else {
        // select first hour
        if (selectedHour === firstHour) {
            for (let i = firstMinute; i < 60; i += 10) {
                minutes.push(i);
            }
        }
        else if (selectedHour === lastHour) {
            for (let i = 0; i <= lastMinute; i += 10) {
                minutes.push(i);
            }
        }
        else {
            for (let i = 0; i < 60; i += 10) {
                minutes.push(i);
            }
        }
    }
};

/*
 * get the validation code
 */
const getValidateCode = (phoneNumber) => {
    let post = function () {
        wx.request({
            url: "https://958107.iterator-traits.com/validate",
            data: {
                phoneNumber: phoneNumber
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                // if success
                if (res.data.success) {
                    alertInfo("发送验证码成功，请等待", "success", 300);
                }
                // if wrong
                else {
                    alertInfo(res.data.info, "none", 1000);
                }
            },
            fail: function (res) {
                // fail
                alertInfo("发送验证码失败，请检查您的网络设备是否连接正常", "none", 1000);
            }
        });
    };

    post();
};

/*
 * check the format of phone number
 */
const checkPhoneNumber = (string) => {
    let ans = false;
    if (string.length === 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(string)) {
        ans = true;
    }
    return ans;
};

/*
 * check the format of real name
 * TODO: format setting.
 */
const checkRealName = (string) => {
    let ans = false;
    if(string.length > 0){
        ans = true;
    }
    return ans;
};

/*
 * check the id number
 */
const checkIdNumber = (string) => {
    let ans = false;
    if(/^[0-9]{17}[0-9X]$/.test(string)){
        ans = true;
    }
    return ans;
};

module.exports = {
    alertInfo: alertInfo,
    formatTime: formatTime,
    formatDate: formatDate,
    setUrl: setUrl,
    getNearestEndTime: getNearestEndTime,
    ENDHOUR: ENDHOUR,
    ENDMINUTE: ENDMINUTE,
    setTimeTemplate: setTimeTemplate,
    md5: md5,
    getValidateCode: getValidateCode,
    checkPhoneNumber: checkPhoneNumber,
    checkRealName: checkRealName,
    checkIdNumber: checkIdNumber
};
