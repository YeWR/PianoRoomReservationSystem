import request from '@/utils/request'

export function getItemLongList(query) {
  return request({
    url: '/manager/longItem/list',
    method: 'get',
    params: query
  })
}

export function addItemLong(data) {
  return request({
    url: '/manager/longItem/create',
    method: 'post',
    data
  })
}

export function delItemLong(data) {
  return request({
    url: '/manager/longItem/delete',
    method: 'post',
    data
  })
}