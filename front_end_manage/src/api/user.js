import request from '@/utils/request'

export function fetchUserList(query) {
  return request({
    url: 'manager/user/list',
    method: 'get',
    params: query
  })
}

// export function checkListByUsername(telephone) {
//   return request({
//     url: '/manager/user/list',
//     method: 'post',
//     telephone
//   })
// }
//
export function joinToBlacklist(id) {
  const data = {'userId': id}
  return request({
    url: 'manager/user/blacklist/set',
    method: 'post',
    data
  })
}
export function outOfBlacklist(id) {
  const data = {'userId': id}
  return request({
    url: 'manager/user/blacklist/remove',
    method: 'post',
    data
  })
}


