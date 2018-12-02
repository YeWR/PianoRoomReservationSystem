import request from '@/utils/request'

export function loginByUsername(userType, userName, password) {
  const data = {
    userType,
    userName,
    password
  }
  return request({
    url: '/manager/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

