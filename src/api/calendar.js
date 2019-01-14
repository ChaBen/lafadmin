import request from '@/utils/request'

export function getList(lang) {
  return request({
    url: `/calendar?lang=${lang}`,
    method: 'get'
  })
}

export function createArticle(data) {
  return request({
    url: '/calendar',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: `/calendar/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: `/calendar/${id}`,
    method: 'delete'
  })
}
