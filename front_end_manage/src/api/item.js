import request from '@/utils/request'

export function getItemList(query) {
  return request({
    url: '/manager/item/list',
    method: 'get',
    params: query
  })
}
