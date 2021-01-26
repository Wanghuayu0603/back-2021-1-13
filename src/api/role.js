import request from '@/utils/request'

// export function getRoutes (data) {
//   return request({
//     url: 'rbac/bind_user.php',
//     method: 'post',
//     data
//   })
// }

// 获取用户列表
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
// 移除用户角色
export function deleteRole (data) {
  return request({
    url: 'rbac/unbind_user.php',
    method: 'post',
    data,
  })
}

// 增加权限
export function addPermission (data) {
  return request({
    url: `rbac/add_policy.php`,
    method: 'post',
    data
  })
}

// 移除权限
export function delPermission (data) {
  return request({
    url: `rbac/remove_policy.php`,
    method: 'post',
    data
  })
}
