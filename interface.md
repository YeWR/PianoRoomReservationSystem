# 接口设置

* 接口格式简介：

  * 每个接口以json格式说明

  * 对于web端接口：

    * `url`表示请求的url
    * `method`表示使用的http方法
    * `data`表示请求的dict的内容
    * `res`表示返回的值

    ```json
    {
        "url": "",
        "method": "",
        "data": {
            
        },
        "res": {
            
        }
    }
    ```

  * 对于...

## 获取验证码

``` json
{
    "url": "/user/code",
    "method": "POST",
    "data":{
        "phoneNumber": "电话号码",
        "state": "代表注册/登录/更改信息等(0/1/2/...)"
    },
    "res":{
        "success": "成功发送",
        "info": "发送失败信息（如果用户未注册，也不能发送验证码）"
    }
}
```

## 注册

```json
{
    "url": "/user/registration",
    "method": "POST",
    "data": {
        "phoneNumber": "电话号码",
        "validateCode": "验证码",
        "realName": "真实姓名",
        "idNumber": "身份证号（加密）"
    },
    "res": {
        "success": "注册成功",
        "info": "注册失败信息（已有身份证、验证码不对等）"
    }
}
```

## Cookie登录

```json
{
    "url": "/user/cookie",
    "method": "GET",
    "data": {
        
    },
    "res": {
        "success": "登录成功",
        "userType": "用户类别：校内学生，校内老师，校外单人",
        "realName": "真实姓名",
        "idNumber": "学号/工号（如果是校内人士的话）",
        "info":"登录失败信息（cookie失效）"
    }
}
```

## 校外登录

```json
{
    "url": "/user/login/outSchool",
    "method": "POST",
    "data": {
        "phoneNumber": "电话号码",
        "validateCode": "验证码"
    },
    "res": {
        "success": "登录成功",
        "realName": "真实姓名",
        "info": "登录失败信息（未注册等）"
    }
}
```

##校内登录

## 琴房选择界面——获取琴房信息

```json
{
    "url": "/piano/all",
    "method": "GET",
    "data": {
        
    },
    "res": {
        "success": "获取琴房信息成功",
        "info": "失败信息",
        "pianoList"(琴房信息列表): [{
            "pianoId": "琴房id",
            "pianoType": "琴种类",
            "timeTable": "0-1串，琴房的可用时间",
            "pianoPlace": "琴的地址"
        }]
    }
}
```

## 琴房介绍界面——获取琴房介绍信息

## 琴房预约界面——获取单个琴房具体信息

``` json
{
    "url": "/piano/detail",
    "method": "GET",
    "data": {
        "pianoId": "琴房号",
        "date": "日期"
    },
    "res": {
        "success":"获取琴房信息成功",
        "info": "失败信息",
        "timeTable": "0-1串，琴房的可用时间",
        "pianoPrices": "琴房单位小时价格，一个dict，总共有4类",
        "pianoInfo": "琴房介绍信息"
    }
}
```

## 琴房预约（暂时无支付功能）

```json
{
    "url": "/reservation/order",
    "method": "POST",
    "data": {
        "number":"号码（手机号/学号）",
        "reservationType": "预约类别(校内学生，校内老师，校外单人，多人)",
        "pianoId":"琴房id",
        "pianoPrice":"价格",
        "date": "日期",
        "begTimeIndex":"开始时间index",
        "endTimeIndex":"结束时间index"
    },
    "res": {
        "success": "预约成功",
        "info": "失败信息",
        "info": "预约失败信息（已被预约等）"
    }
}
```

 ## 预约提醒界面

```json
{
    "url": "/reservation/alarm",
    "method": "GET",
    "data": {
        "number":"号码（手机号/学号）"
    },
    "res": {
        "success": "预约订单获取成功",
        "info": "失败信息",
        "reservationList"(可用订单信息列表，正在使用，未使用): [{
            "pianoPlace":"琴房地点",
       		"pianoType":"钢琴简介信息",
        	"pianoPrice": "预约价格",
        	"reservationId": "订单号",
        	"reservationType": "预约类别",
        	"reservationState":"预约状态（正在使用、未生效）",
        	"date":"预约日期(2018-11-14)",
        	"weekday": "星期几(星期三/周三)",
        	"begTimeIndex":"开始时间index",
        	"endTimeIndex":"结束时间index",
        }]
    }
}
```

## 订单退订

```json
{
    "url": "/reservation/refundment",
    "method": "POST",
    "data": {
        "reservationId": "订单号"
    },
    "res": {
        "success": "退订成功",
        "info": "退订失败信息"
    }
}
```

## 历史订单（所有订单信息）

```json
{
    "url": "/reservation/all",
    "method": "GET",
    "data": {
        "number":"号码（手机号/学号）"
    },
    "res": {
        "success": "获取历史订单成功",
        "info": "退订失败信息",
        "reservationList"(可用订单信息列表，已使用，正在使用，未使用): [{
            "pianoPlace":"琴房地点",
       		"pianoType":"钢琴简介信息",
        	"pianoPrice": "预约价格",
        	"reservationId": "订单号",
        	"reservationType": "预约类别",
        	"reservationState":"预约状态（正在使用、未生效）",
        	"date":"预约日期(2018-11-14)",
        	"weekday": "星期几(星期三/周三)",
        	"begTimeIndex":"开始时间index",
        	"endTimeIndex":"结束时间index",
        }]
    }
}
```

## 公告界面——获取所有公告

```json
{
    "url": "/notice/all",
    "method": "GET",
    "data": {
    },
    "res": {
        "success": "获取公告信息成功",
        "info": "获取失败信息",
        "noticeList"(所有公告信息，逆序排列): [{
            "noticeTitle": "公告标题",
        	"noticeContent": "公告内容",
        	"noticeKey": "公告简略内容",
            "noticeTime": "公告时间",
            "noticeAuthor": "公告发布人",
            "noticeId": "公告唯一id",
        }]
    }
}
```

