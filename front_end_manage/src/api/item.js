import request from '@/utils/request'

export function getItemList(query) {
  return request({
    url: '/manager/item/list',
    method: 'get',
    params: query
  })
}

export function getItemScan() {
  return request({
    url: '/manager/item/scan',
    method: 'get'
  })
}

export function deleteItem(itemId) {
  const data = {'itemId': itemId}
  return request({
    url: '/manager/item/refundment',
    method: 'post',
    data
  })
}
