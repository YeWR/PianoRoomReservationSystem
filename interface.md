# 接口设置

* 接口格式简介：

  * 每个接口以json格式说明

  * 对于web端接口：

    * `url`表示post的url
    * `data`表示post的dict的内容
    * `res`表示返回的值

    ```json
    {
        "url": "",
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
    "url": "/validate",
    "data":{
        "phoneNumber": "电话号码"
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
    "url": "/register",
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

## 校外登录

```json
{
    "url": "/login/outSchool",
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
    "url": "/reserve/all",
    "data": {
        
    },
    "res": {
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
    "url": "/reserve/detail",
    "data": {
        "pianoId": "琴房号",
        "date": "日期"
    },
    "res": {
        "timeTable": "0-1串，琴房的可用时间",
        "pianoPrices": "琴房单位小时价格，一个dict，总共有4类",
        "pianoInfo": "琴房介绍信息"
    }
}
```

## 琴房预约（暂时无支付功能）

```json
{
    "url": "/reserve/order",
    "data": {
        "phoneNumber":"用户（手机号）",
        "pianoId":"琴房id",
        "userType":"用户类别：校内单人，校外单人，多人等",
        "pianoPrice":"价格",
        "begTimeIndex":"开始时间index",
        "endTimeIndex":"结束时间index"
    },
    "res": {
        "success": "预约成功",
        "info": "预约失败信息（已被预约等）"
    }
}
```

 