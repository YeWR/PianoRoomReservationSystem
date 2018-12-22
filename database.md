#  database

### campus_user

| field    | type        | content                           | 是否必填 |
| -------- | ----------- | --------------------------------- | -------- |
| cam_type | int(11)     | 学生（1），老师（2），黑名单（0） | 是       |
| cam_id   | varchar(20) | 校内卡号                          | 是       |
| cam_name | varchar(40) | 用户名（姓名）                    | 是       |
| cam_tele | varchar(11) | 电话                              | 否       |

```mysql
CREATE TABLE campus_user(cam_type INT not null, cam_id VARCHAR(20) not null, cam_name VARCHAR(40) not null, cam_tele VARCHAR(11))ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

### society_user

| field        | type         | content                | 是否必填 |
| ------------ | ------------ | ---------------------- | -------- |
| soc_type     | int(11)      | 用户（1），黑名单（0） | 是       |
| soc_id       | varchar(100) | 身份证号（加密之后）   | 是       |
| soc_realname | varchar(40)  | 用户真实姓名           | 是       |
| soc_tele     | varchar(11)  | 电话                   | 是       |
| soc_uuid     | varchar(16)  | 用户uuid               | 是       |

```mysql
CREATE TABLE society_user(soc_type INT not null, soc_id VARCHAR(100) not null, soc_realname VARCHAR(40) not null, soc_tele VARCHAR(11) not null, soc_uuid VARCHAR(16) not null)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

### auth_user

| field         | type        | content            | 是否必填 |
| ------------- | ----------- | ------------------ | -------- |
| auth_type     | int(11)     | root(0), sudo(1)   | 是       |
| auth_name     | varchar(40) | 用户名（加密之后） | 是       |
| auth_password | varchar(40) | 密码（加密之后）   | 是       |

```mysql
CREATE TABLE auth_user(auth_type INT not null, auth_name VARCHAR(40) not null, auth_password VARCHAR(40) not null)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

### item

| field         | type        | content                                                      | 是否必填 |
| ------------- | ----------- | ------------------------------------------------------------ | -------- |
| item_date     | datetime    | 订单开始日期                                                 | 是       |
| item_username | varchar(20) | 用户名(即uuid)                                               | 是       |
| item_roomId   | int(11)     | 房间id                                                       | 是       |
| item_type     | int(11)     | 未使用（1），已使用（2），退订（0）,长期未缴费（-1），长期已缴费（-2），长期已使用（-3） | 是       |
| item_member   | int(11)     | 使用人数                                                     | 是       |
| item_value    | float       | 金额                                                         | 是       |
| item_id       | int(11)     | 自动递增的id(key)                                            | 是       |
| item_duration | int(11)     | 以10min为一个单位                                            | 是       |
| item_begin    | int(11)     | 开始的index                                                  | 是       |
| item_uuid     | varchar(64) | 订单uuid                                                     | 是       |

```mysql
CREATE TABLE item(item_id INT primary key not null auto_increment, item_date DATETIME not null, item_duration INT not null, item_begin INT not null,item_username varchar(20) not null, item_roomId INT not null, item_type INT not null, item_member INT not null, item_value FLOAT not null, item_uuid VARCHAR(64) not null)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

### piano
| field            | type         | content                        | 是否必填 |
| ---------------- | ------------ | ------------------------------ | -------- |
| piano_list       | blob         | 琴房可用时间序列               | 是       |
| piano_id         | int(11)      | 琴的id                         | 是       |
| piano_room       | int(11)      | 房间号                         | 是       |
| piano_picurl     | varchar(50)  | 琴房                           | 是       |
| piano_info       | varchar(500) | 琴房简介                       | 是       |
| piano_stuvaule   | int(11)      | 学生价格                       | 是       |
| piano_teavalue   | int(11)      | 教师价格                       | 是       |
| piano_socvalue   | int(11)      | 校外价格                       | 是       |
| piano_multivalue | int(11)      | 多人价格                       | 是       |
| piano_type       | varchar(40)  | 琴的类型                       | 是       |
| piano_status     | int(11)      | 琴是否开放(1为开放，0为不开放) | 是       |
| piano_rule       | blob         | 琴房不可用时间                 | 是       |

```sql
CREATE TABLE piano(piano_list BLOB not null, piano_rule BLOB not null, piano_status INT not null, piano_id INT not null, piano_room INT not null, piano_picurl VARCHAR(50) not null, piano_info VARCHAR(500) NOT NULL, piano_stuvalue INT not null, piano_teavalue INT not null, piano_socvalue INT not null, piano_multivalue INT not null, piano_type VARCHAR(40) not null)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

### notice

| field        | type         | content              | 是否必填 |
| ------------ | ------------ | -------------------- | -------- |
| notice_title | varchar(100) | 公告标题             | 是       |
| notice_cont  | varchar(500) | 公告内容             | 是       |
| notice_time  | datatime     | 公告发布时间         | 是       |
| notice_auth  | varchar(20)  | 发布人               | 是       |
| notice_id    | int(11)      | 自动增长的id         | 是       |
| notice_type  | int(11)      | 删除（0），显示（1） | 是       |

```mysql
CREATE TABLE notice(notice_id INT primary key not null auto_increment, notice_title VARCHAR(100) not null, notice_cont VARCHAR(500) NOT NULL, notice_time DATETIME not null, notice_auth VARCHAR(20) not null， notice_type INT not null)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

