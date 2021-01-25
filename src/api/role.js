import request from '@/utils/request'

// export function getRoutes (data) {
//   return request({
//     url: 'rbac/bind_user.php',
//     method: 'post',
//     data
//   })
// }

export function getUsers () {
  return request({
    url: 'rbac/read.php',
    method: 'get'
  })
}

// 绑定用户角色
export function addRole (data) {
  return request({
    url: 'rbac/bind_user.php',
    method: 'post',
    data,
  })
}

export function updateRole (id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

// 移除用户角色
export function deleteRole (data) {
  return request({
    url: 'rbac/unbind_user.php',
    method: 'post',
    data,
  })
}
