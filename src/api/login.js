import request from '@/utils/request'

export function login(userinfo) {
  return request({
    url: '/authentication',
    method: 'post',
    data: userinfo
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
