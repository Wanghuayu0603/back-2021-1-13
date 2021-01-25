import request from '@/utils/request'

// export function login (data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

export function login (data) {
  return request({
    url: 'user/login.php',
    method: 'post',
    data
  })
}

export function getAsyncRoutes (token) {
  return request({
    url: 'route.php',
    method: 'get',
    params: ''
  })
}

export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
