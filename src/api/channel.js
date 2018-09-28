import request from '@/utils/request'

export function getList() {
  return request({
    url: '/channel',
    method: 'get'
  })
}

export function createArticle(data) {
  return request({
    url: '/channel',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: `/channel/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: `/channel/${id}`,
    method: 'delete'
  })
}
