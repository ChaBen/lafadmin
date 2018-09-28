import request from '@/utils/request'

export function getList(lang) {
  return request({
    url: `/press?lang=${lang}`,
    method: 'get'
  })
}

export function createArticle(data) {
  return request({
    url: '/press',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: `/press/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: `/press/${id}`,
    method: 'delete'
  })
}
