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

## 用户

###获取验证码

``` json
{
    "url": "/user/code",
    "method": "POST",
    "data":{
        "phoneNumber": "电话号码",
        "state": "代表注册/登录/更改信息等(0/1/2/...)"
    },
    "res":{
        "data": {
            "success": "成功发送",
            "info": "发送失败信息（如果用户未注册，也不能发送验证码）"
        }
    }
}
```

###校外用户注册

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
        "data": {
            "success": "注册成功",
            "info": "注册失败信息（已有身份证、验证码不对等）"
        }
    }
}
```

###Cookie登录

```json
{
    "url": "/user/cookie",
    "method": "GET",
    "data": {
        
    },
    "res": {
        "data": {
            "success": "登录成功",
            "userType": "用户类别：校内学生，校内老师，校外单人",
            "realName": "真实姓名",
            "idNumber": "学号/工号（如果是校内人士的话）",
            "info":"登录失败信息（cookie失效）"
        }
    }
}
```

###校外登录

```json
{
    "url": "/user/login/outSchool",
    "method": "POST",
    "data": {
        "phoneNumber": "电话号码",
        "validateCode": "验证码"
    },
    "res": {
        "data": {
            "success": "登录成功",
            "realName": "真实姓名",
            "info": "登录失败信息（未注册等）"   
        }
    }
}
```

###校内登录

```json
{
    "url": "/user/login/inSchool",
    "method": "POST",
    "data": {
        "ticket": "id.tsinghua产生的用户票据"
    },
    "res": {
        "data": {
            "success": "登录成功",
            "token": "用户token",
            "userType": "用户类型",
            "idNumber": "学号/工作证号",
            "username": "用户姓名"
        }
    }
}
```

###琴房选择界面——获取琴房信息

```json
{
    "url": "/user/piano/all",
    "method": "GET",
    "data": {
        
    },
    "res": {
        "data": {
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
}
```

###琴房预约界面——获取单个琴房具体信息

``` json
{
    "url": "/user/piano/detail",
    "method": "GET",
    "data": {
        "pianoId": "琴房号",
        "date": "日期"
    },
    "res": {
        "data": {
            "success":"获取琴房信息成功",
            "info": "失败信息",
            "timeTable": "0-1串，琴房的可用时间",
            "pianoPrices": "琴房单位小时价格，一个dict，总共有4类",
            "pianoInfo": "琴房介绍信息"
        }
    }
}
```

###琴房预约下单

```json
{
    "url": "/user/reservation/order",
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
        "data": {
            "success": "下单成功，需要为支付准备",
            "info": "预约失败信息（已被预约等）",
            "reservationId": "生成未支付订单的uuid"
        }
    }
}
```

###支付未支付/长期预约未支付订单

```json
{
    "url": "/user/reservation/pay",
    "method": "POST",
    "data": {
        "openid": "用户的openid",
        "reservationId": "订单uuid",
    },
    "res": {
        "data": {
            "success": "下单成功，需要为支付准备",
            "info": "预约失败信息（已被预约等）",
            "sign": {
                "timeStamp": "时间戳",
                "nonceStr": "随机串",
                "package": "package",
                "paySign": "paySign"
            }
        }
    }
}
```

###微信支付回调

```json
{
    "url": "/user/reservation/validate",
    "method": "POST",
    "data": {
        "uuid": "订单uuid (url参数)",
        "其他": "微信支付回调信息"
    },
    "res": "按照微信支付文档要求"
    }
}
```

###预约提醒界面

```json
{
    "url": "/user/reservation/alarm",
    "method": "GET",
    "data": {
        "number":"号码（手机号/学号）"
    },
    "res": {
        "data": {
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
}
```

###查看未支付/长期预约未支付订单

```json
{
    "url": "/user/reservation/notpaid",
    "method": "GET",
    "data": {
        "number":"号码（手机号/学号）"
    },
    "res": {
        "data": {
            "success": "获取历史订单成功",
            "info": "失败信息",
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
                "deadlineTime":"订单失效时间的时间戳"
            }]
        }
    }
}
```

###订单退订

```json
{
    "url": "/user/reservation/refundment",
    "method": "POST",
    "data": {
        "reservationId": "订单号"
    },
    "res": {
        "data": {
            "success": "退订成功",
            "info": "退订失败信息"
        }
    }
}
```

###历史订单（所有订单信息）

```json
{
    "url": "/user/reservation/all",
    "method": "GET",
    "data": {
        "number":"号码（手机号/学号）"
    },
    "res": {
        "data": {
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
}
```

###公告界面——获取所有公告

```json
{
    "url": "/user/notice/all",
    "method": "GET",
    "data": {
    },
    "res": {
        "data": {
            "success": "获取公告信息成功",
            "info": "获取失败信息",
            "noticeList(所有公告信息，逆序排列)": [{
                "noticeTitle": "公告标题",
                "noticeContent": "公告内容",
                "noticeKey": "公告简略内容",
                "noticeTime": "公告时间",
                "noticeAuthor": "公告发布人",
                "noticeId": "公告唯一id",
            }]
        }
    }
}
```



## 管理员

### 登录

```json
{
    "url": "/manager/login",
    "method": "POST",
    "data": {
        "userType": "类型: 0->管理员 1->审核人员",
        "userName": "用户名",
        "password": "密码"
    },
    "res": {
        "status": "状态码，200 -> 成功，401 -> 失败",
        "data": {
            "token": "cookie"
        }
    }
}
```

### 管理员登出

```json
{
    "url": "/manager/logout",
    "method": "POST",
    "data": {
    },
    "res": {
        "status": "状态码，200 -> 成功，401 -> 失败",
    }
}
``` 


### 获取管理员信息

```json
{
    "url": "/manager/info",
    "method": "GET",
    "data": {
        "token": "cookie"
    },
    "res": {
        "status": "状态码，200 -> 成功，401 -> 失败",
        "data": {
            "name": "姓名",
            "roles": "[(权限)]"
        }
    }
}
``` 

### 获取订单信息

```json
{
    "url": "/manager/item/list",
    "method": "GET",
    "query": {
        "page": "页码",
        "limit": "每页最多个数",
        "idNumber": "手机号/证号",
        "room": "琴房号",
        "itemType": "订单类型",
        "status": "订单状态",
        "timeSort": "+代表顺序,-代表逆序"
    },
    "res": {
        "status": "状态码，200 -> 成功",
        "data": {
            "list": [{
                "itemId": "订单id",
                "idNumber": "手机号/证号",
                "room": "琴房号",
                "itemType": "订单类型",
                "userType": "用户类型",
                "pianoType": "钢琴类型",
                "price": "钢琴价格",
                "status": "订单状态",
                "time": "订单时间"
            }],
            "total": "总条数"
        }
    }
}
``` 

### 获取订单速览(今日所有订单)

```json
{
    "url": "/manager/item/scan",
    "method": "GET",
    "data": {
    },
    "res": {
        "status": "状态码，200 -> 成功",
        "data": {
            "list": [{
                "itemId": "订单id",
                "idNumber": "手机号/证号",
                "room": "琴房号",
                "itemType": "订单类型",
                "userType": "用户类型",
                "pianoType": "钢琴类型",
                "price": "钢琴价格",
                "status": "订单状态",
                "time": "订单时间"
            }]
        }
    }
}
``` 

###管理员删除退订

```json
{
    "url": "/manager/item/refundment",
    "method": "POST",
    "data": {
        "itemId": "订单号"
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败",
        "info": "失败信息"
    }
}
```

###检票

```json
{
    "url": "/manager/checkin",
    "method": "GET",
    "data": {
        "id": "订单号"
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败",
        "info": "失败信息"
    }
}
```

###用户列表

```json
{
    "url": "/manager/user/list",
    "method": "GET",
    "query": {
        "page": "页码",
        "limit": "每页最多个数",
        "number": "学号/工作证号/手机号",
        "id": "真实姓名",
        "IDnumber": "身份证号",
        "type": "用户类型",
        "blackOrnot": "是否在黑名单中"
    },
    "res": {
        "status": "状态码，200 -> 成功",
        "data": {
            "list": [{
                "id": "用户姓名",
                "telephone": "用户学号/工作证号/手机号",
                "type": "用户类型",
                "status": "用户是否在黑名单中",
                "userId": "用户uuid"
            }],
            "total": "该查询条件下用户总数"
        }
    }
}
```

###加入黑名单

```json
{
    "url": "/blacklist/set",
    "method": "POST",
    "data": {
        "userId": "用户的uuid"
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败",
        "info": "失败信息"
    }
}
```

###移除黑名单

```json
{
    "url": "/blacklist/remove",
    "method": "POST",
    "data": {
        "userId": "用户的uuid"
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败",
        "info": "失败信息"
    }
}
```

###琴房列表

```json
{
    "url": "/manager/room/list",
    "method": "GET",
    "query": {
        "page": "页码",
        "limit": "每页最多个数",
        "room": "房间号",
        "roomType": "琴房类型",
    },
    "res": {
        "status": "状态码，200 -> 成功",
        "data": {
            "items": [{
                "id": "琴房编号(自动递增)",
                "room": "琴房房间号",
                "type": "琴房类型",
                "status": "琴房状态(开放/不开放)",
                "stuValue": "学生使用价格",
                "teaValue": "教职工使用价格",
                "socValue": "校外人员使用价格",
                "multiValue": "多人使用价格",
                "info": "琴房详细信息"
            }],
            "total": "该查询条件下琴房总数"
        }
    }
}
```

###琴房详细信息

```json
{
    "url": "/manager/room/detail",
    "method": "GET",
    "query": {
            "id": "琴房编号"
    },
    "res": {
        "status": "状态码，200 -> 成功",
        "data": {
            "items": [{
                "id": "琴房编号(自动递增)",
                "room": "琴房房间号",
                "type": "琴房类型",
                "status": "琴房状态(开放/不开放)",
                "stuValue": "学生使用价格",
                "teaValue": "教职工使用价格",
                "socValue": "校外人员使用价格",
                "multiValue": "多人使用价格",
                "info": "琴房详细信息",
                "disabled": "琴房规则(不可用时间)"
            }],
            "total": "该查询条件下琴房总数"
        }
    }
}
```

###新建琴房

```json
{
    "url": "/manager/room/create",
    "method": "POST",
    "data": {
        "room": "琴房房间号",
        "type": "琴房类型",
        "status": "琴房状态(开放/不开放)",
        "stuValue": "学生使用价格",
        "teaValue": "教职工使用价格",
        "socValue": "校外人员使用价格",
        "multiValue": "多人使用价格",
        "info": "琴房详细信息",
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败",

    }
}
```

###修改琴房信息

```json
{
    "url": "/manager/room/info",
    "method": "POST",
    "data": {
        "id": "琴房编号",
        "room": "琴房房间号",
        "type": "琴房类型",
        "stuValue": "学生使用价格",
        "teaValue": "教职工使用价格",
        "socValue": "校外人员使用价格",
        "multiValue": "多人使用价格",
        "info": "琴房详细信息",
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败",

    }
}
```

###修改琴房状态

```json
{
    "url": "/manager/room/status",
    "method": "POST",
    "data": {
        "id": "琴房编号",
        "status": "琴房状态(0->关闭,1-> 开放)",
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败",
        "info": "失败原因(如仍有未使用订单)"
    }
}
```

###新增/删除琴房规则

```json
{
    "url": "/manager/room/rule",
    "method": "POST",
    "data": {
        "id": "琴房编号",
        "start": "开始时间",
        "end": "结束时间",
        "week": "星期",
        "type": "(0->删除,2->添加)",
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败",
        "info": "失败原因(如与订单/长期预约冲突)"
    }
}
```

###修改琴房规则

```json
{
    "url": "/manager/room/ruleChange",
    "method": "POST",
    "data": {
        "id": "琴房编号",
        "oldStart": "旧规则开始时间",
        "oldEnd": "旧规则结束时间",
        "newStart": "新规则开始时间",
        "newEnd": "新规则结束时间",
        "week": "星期",
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败",
        "info": "失败原因(如与订单/长期预约冲突)"
    }
}
```

###公告列表

```json
{
    "url": "/manager/notice/list",
    "method": "GET",
    "query": {
        "page": "页码",
        "limit": "每页最多个数",
        "title": "标题",
        "author": "发布人",
        "dateSort": "按照时间排序,+代表顺序,-代表逆序"
    },
    "res": {
        "status": "状态码，200 -> 成功",
        "data": {
            "items": [{
                "title": "公告标题",
                "date": "发布日期",
                "author": "发布人",
                "id": "公告编号",
            }],
            "total": "该查询条件下公告总数"
        }
    }
}
```

###公告详情

```json
{
    "url": "/manager/notice/detail",
    "method": "GET",
    "query": {
            "id": "公告编号",
    },
    "res": {
        "status": "状态码，200 -> 成功",
        "data": {
            "title": "公告标题",
            "date": "发布日期",
            "author": "发布人",
            "content": "公告具体内容"
        }
    }
}
```

###新增公告

```json
{
    "url": "/manager/notice/create",
    "method": "POST",
    "data": {
            "title": "公告标题",
            "time": "发布时间",
            "author": "发布人",
            "content": "公告具体内容"
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败"
    }
}
```

###删除公告

```json
{
    "url": "/manager/notice/delete",
    "method": "POST",
    "data": {
            "id": "公告编号"
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败"
    }
}
```

###长期预约列表

```json
{
    "url": "/manager/longItem/list",
    "method": "GET",
    "query": {
        "page": "页码",
        "limit": "每页最多个数",
        "number": "用户学号/工作证号/手机号",
        "room": "琴房房间号",
        "week": "星期",
        "type": "长期预约类型(单人/多人)"
    },
    "res": {
        "status": "状态码，200 -> 成功",
        "data": {
            "items": [{
                "item_long_week": "长期预约星期",
                "item_long_userid": "用户学号/工作证号/手机号",
                "item_long_pianoId": "琴房房间号",
                "item_long_id": "长期预约编号",
                "item_long_duration": "长期预约使用时间",
                "item_long_begin": "长期预约开始使用时间",
                "item_long_status": "长期预约状态",
                "item_long_type": "长期预约类型"

            }],
            "count": "该查询条件下长期预约总数"
        }
    }
}
```

###添加长期预约

```json
{
    "url": "/manager/longItem/create",
    "method": "POST",
    "data": {
        "id": "用户学号/工作证号/手机号",
        "room": "琴房房间号",
        "week": "星期",
        "start": "开始时间",
        "end": "结束时间",
        "type": "长期预约类型(单人/多人)"
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败",
        "info": "失败信息(与规则冲突等)"
        }
    }
}
```

###删除长期预约

```json
{
    "url": "/manager/longItem/delete",
    "method": "POST",
    "data": {
        "id": "长期预约编号"
    },
    "res": {
        "status": "状态码，200 -> 成功，400 -> 失败"
        }
    }
}
```





