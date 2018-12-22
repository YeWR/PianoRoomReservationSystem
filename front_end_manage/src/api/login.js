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
    url: '/manager/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/manager/info',
    method: 'get',
    params: { token }
  })
}

