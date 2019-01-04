### database.md
####user

| field   | type   | content   | 是否必填   |
|:----|:----|:----|-----|
| type    |  int(11)        |  用户类型  |  是          |
|  id      |  varchar(100)  |  身份证号（加密之后）                   |  是          |
|  realname  |  varchar(40)    |  用户名（姓名）                       |  是          |
|  number   |  varchar(11)    |  电话/学校卡号                               |  是   |
| uuid   | varchar(16)   | uuid   | 是   |
| status   | int(11)   | 用户状态   | 是   |

####item

| field   | type   | content   | 是否必填   |
|:----|:----|:----|:----|
|  item_date        |  datetime       |  订单开始日期                           | 是          |
|  item_username    |  varchar(20)    |  用户名(即uuid)                         | 是          |
|  item_roomId      |  int(11)        |  房间id                                 | 是          |
|  item_type        |  int(11)        | 订单状态   | 是          |
|  item_member      |  int(11)        |  使用人数                               | 是          |
|  item_value       |  float          |  金额                                   | 是          |
|  item_id          |  int(11)        |  自动递增的id(key)                      | 是          |
|  item_duration    |  int(11)        |  以10min为一个单位                      | 是          |
|  item_begin       |  int(11)        |  开始的index                            | 是          |
|  item_uuid        |  varchar(64)    |  订单uuid                               | 是          |
| item_time   | datatime   | 下订单的时间   | 是   |

####item_long

| field   | type   | content   | 是否必填   |
|:----|:----|:----|:----|
|  item_long_week        |  int(11)        |  星期几                  |  是          |
|  item_long_userid      |  varchar(20)    |  用户名(即uuid)          |  是          |
|  item_long_pianoId     |  int(11)        |  房间id                  |  是          |
|  item_long_id          |  int(11)        |  自动递增的id(key)       |  是          |
|  item_long_duration    |  int(11)        |  以10min为一个单位       |  是          |
|  item_long_begin       |  int(11)        |  开始的index             |  是          |
|  item_long_status      |  int(11)        |  长期预约状态   |  是          |
|  item_long_type        |  int(11)        | 长期预约类型      |  是          |

####piano

| field   | type   | content   | 是否必填   |
|:----|:----|:----|:----|
|  piano_list          |  blob            |  琴房可用时间序列                  |  是          |
|  piano_id            |  int(11)         |  琴的id                            |  是          |
|  piano_room          |  int(11)         |  房间号                            |  是          |
|  piano_info          |  varchar(500)    |  琴房简介                          |  是          |
|  piano_stuvaule      |  int(11)         |  学生价格                          |  是          |
|  piano_teavalue      |  int(11)         |  教师价格                          |  是          |
|  piano_socvalue      |  int(11)         |  校外价格                          |  是          |
|  piano_multivalue    |  int(11)         |  多人价格                          |  是          |
|  piano_type          |  varchar(40)     |  琴的类型                          |  是          |
|  piano_status        |  int(11)         |  琴是否开放(1为开放，0为不开放)    |  是          |
|  piano_rule          |  blob            |  琴房不可用时间                    |  是          |

####notice

| field   | type   | content   | 是否必填   |
|:----|:----|:----|:----|
|  notice_title    |  varchar(100)    |  公告标题                |  是          |
|  notice_cont     |  varchar(500)    |  公告内容                |  是          |
|  notice_time     |  datatime        |  公告发布时间            |  是          |
|  notice_auth     |  varchar(20)     |  发布人                  |  是          |
|  notice_id       |  int(11)         |  自动增长的id            |  是          |
|  notice_type     |  int(11)         |  删除（0），显示（1）    |  是          |



