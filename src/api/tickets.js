import request from '@/utils/request'

export function getList() {
  return request({
    url: '/tickets',
    method: 'get'
  })
}

export function updateArticle(data) {
  return request({
    url: `/tickets/${data.id}`,
    method: 'put',
    data
  })
}
