import request from '@/utils/request'

export function fetchList(query) {
  console.log(query)
  return request({
    url: '/manager/notice/list',
    method: 'get',
    params: query
  })
}

export function fetchDetail(id) {
  return request({
    url: '/manager/notice/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/manager/notice/pv',
    method: 'get',
    params: { pv }
  })
}

export function createNotice(data) {
  return request({
    url: '/manager/notice/create',
    method: 'post',
    data
  })
}

export function DeleteNotice(data) {
  return request({
    url: '/manager/notice/delete',
    method: 'post',
    data
  })
}
