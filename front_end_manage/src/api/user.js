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
  return request({
    url: '/blacklist/set',
    method: 'post',
    id
  })
}
export function outOfBlacklist(id) {
  return request({
    url: '/blacklist/delete',
    method: 'post',
    id
  })
}


