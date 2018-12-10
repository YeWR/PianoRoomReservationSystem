import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/manager/room/list',
    method: 'get',
    query
  })
}

export function fetchDetail(id) {
  return request({
    url: '/manager/room/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/manager/room/pv',
    method: 'get',
    params: { pv }
  })
}

export function createRoom(data) {
  return request({
    url: '/manager/room/create',
    method: 'post',
    data
  })
}

export function DeleteRoom(data) {
  return request({
    url: '/manager/room/delete',
    method: 'post',
    data
  })
}
