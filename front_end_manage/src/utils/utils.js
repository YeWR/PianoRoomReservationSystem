/*
 * user type
 * enum type
 */
const USERTYPE = {};
USERTYPE.STUDENT = 0;
USERTYPE.TEACHER = 1;
USERTYPE.SOCIAL = 2;
USERTYPE.MULTI = 3;

const setUserTypeDiscription = (userType) => {
  let dis = "信息获取错误";
  switch (userType) {
    case USERTYPE.STUDENT:
      dis = "学生";
      break;
    case USERTYPE.TEACHER:
      dis = "教职工";
      break;
    case USERTYPE.SOCIAL:
      dis = "校外人士";
      break;
    case USERTYPE.MULTI:
      dis = "多人";
      break
  }
  return dis;
}

/*
 * reservation state
 */
const RESERVATIONSTATE = {};
RESERVATIONSTATE.NOTUSED = 1;
RESERVATIONSTATE.USED = 2;
RESERVATIONSTATE.LONGNOTPAYED = -1;
RESERVATIONSTATE.LONGPAYED = -2;
RESERVATIONSTATE.LONGUSED = -3;

const setRsvStateDiscription = (reservationState) => {
  let dis = "信息获取错误";
  switch (reservationState) {
    case RESERVATIONSTATE.NOTUSED:
      dis = "未使用";
      break;
    case RESERVATIONSTATE.USED:
      dis = "已使用";
      break;
    case RESERVATIONSTATE.LONGNOTPAYED:
      dis = "长期未缴费";
      break;
    case RESERVATIONSTATE.LONGPAYED:
      dis = "长期已缴费";
      break;
    case RESERVATIONSTATE.LONGUSED:
      dis = "长期已使用";
      break;
  }
  return dis;
}

module.exports = {
  USERTYPE: USERTYPE,
  setUserTypeDiscription: setUserTypeDiscription,
  RESERVATIONSTATE: RESERVATIONSTATE,
  setRsvStateDiscription: setRsvStateDiscription,
}
