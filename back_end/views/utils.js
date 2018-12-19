let getDateStr_Index = function  (date, p) {
    let dateStr = date.getFullYear().toString() + "-";
    let month = date.getMonth()+1;
    let day = date.getDate();
    if(month < 10)
    {
        dateStr = dateStr + "0" + month.toString() + "-";
    }
    else
    {
        dateStr = dateStr + month.toString() + "-";
    }
    if(day < 10)
    {
        dateStr = dateStr + "0" + day.toString();
    }
    else
    {
        dateStr = dateStr + day.toString();
    }
    if(p)
    {
        dateStr += " ";
        let startHour = 8 + Math.floor(p.item_begin / 6);
        let startMinute = 10 * (p.item_begin % 6);
        let endHour = 8 + Math.floor((p.item_begin + p.item_duration) / 6);
        let endMinute = 10 * ((p.item_begin + p.item_duration) % 6);
        if (startHour < 10) {
            dateStr = dateStr + "0" + startHour.toString() + ":";
        }
        else {
            dateStr = dateStr + startHour.toString() + ":";
        }
        if (startMinute < 10) {
            dateStr = dateStr + "0" + startMinute.toString() + "-";
        }
        else {
            dateStr = dateStr + startMinute.toString() + "-";
        }
        if (endHour < 10) {
            dateStr = dateStr + "0" + endHour.toString() + ":";
        }
        else {
            dateStr = dateStr + endHour.toString() + ":";
        }
        if (endMinute < 10) {
            dateStr = dateStr + "0" + endMinute.toString();
        }
        else {
            dateStr = dateStr + endMinute.toString();
        }
    }
    return dateStr;
}

let getDatetimeStr = function (date) {
    let dateStr = date.getFullYear().toString() + "-";
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    if(month < 10)
    {
        dateStr = dateStr + "0" + month.toString() + "-";
    }
    else
    {
        dateStr = dateStr + month.toString() + "-";
    }
    if(day < 10)
    {
        dateStr = dateStr + "0" + day.toString();
    }
    else
    {
        dateStr = dateStr + day.toString();
    }
    if(hour < 10)
    {
        dateStr = dateStr + " " + "0" + hour.toString();
    }
    else
    {
        dateStr = dateStr + " " + hour.toString();
    }
    if(minute < 10)
    {
        dateStr = dateStr + ":0" + minute.toString();
    }
    else
    {
        dateStr = dateStr + ":" + minute.toString();
    }
    return dateStr;
}

let getDateStr = function (date) {
    let dateStr = date.getFullYear().toString() + "-";
    let month = date.getMonth()+1;
    let day = date.getDate();
    if(month < 10)
    {
        dateStr = dateStr + "0" + month.toString() + "-";
    }
    else
    {
        dateStr = dateStr + month.toString() + "-";
    }
    if(day < 10)
    {
        dateStr = dateStr + "0" + day.toString();
    }
    else
    {
        dateStr = dateStr + day.toString();
    }
    return dateStr;
}

let compTime = function (nowdate, date, endIndex)
{
    date.setHours(8+Math.floor(endIndex/6),10*(endIndex%6),0);
    //console.log("nowdate ", nowdate, "date ", date);
    if(date.getTime() - nowdate.getTime() > 0)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

exports.getDateStr_Index = getDateStr_Index;
exports.getDatetimeStr = getDatetimeStr;
exports.getDateStr = getDateStr;
exports.compTime = compTime;