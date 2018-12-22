import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/manager/room/list',
    method: 'get',
    params: query 
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

export function InfoRoom(data) {
  return request({
    url: '/manager/room/info',
    method: 'post',
    data
  })
}

export function StatusRoom(data) {
  return request({
    url: '/manager/room/status',
    method: 'post',
    data
  })
}

export function RuleRoom(data) {
  return request({
    url: '/manager/room/rule',
    method: 'post',
    data
  })
}

export function RuleChangeRoom(data) {
  return request({
    url: '/manager/room/ruleChange',
    method: 'post',
    data
  })
}
