import request from '@/utils/request'

export function fetchList(id) {
  return request({
    url: '/manager/checkin',
    method: 'get',
    params: {id}
  })
}
