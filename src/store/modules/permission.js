import { constantRoutes } from '@/router'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}



function filterAsyncRouter (asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象

  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {//Layout组件特殊处理
        route.component = Layout
      } else {
        if (route.path == 'role') {
          route.component = () => import('@/views/permission/role')
        } else if (route.path == 'table') {
          route.component = () => import('@/views/table/index')
        }
        // route.component = () => import(`@/${route.component}`)
        // route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}
// export function getAsyncRoutes (routes) {
//   const res = []
//   const keys = ['path', 'name', 'children', 'redirect', 'alwaysShow', 'meta', 'hidden']
//   routes.forEach(item => {
//     const newItem = {}
//     if (item.component) {
//       if (item.component === 'Layout') {
//         newItem.component = Layout
//       } else {
//         newItem.component = () => import(`@/${item.component}`)
//       }
//     }
//     for (const key in item) {
//       if (keys.includes(key)) {
//         newItem[key] = item[key]
//       }
//     }
//     if (newItem.children && newItem.children.length) {
//       newItem.children = getAsyncRoutes(item.children)
//     }
//     res.push(newItem)
//   })
//   return res
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes ({ commit }, route) {
    return new Promise(resolve => {
      let accessedRoutes
      console.log(route)
      const asyncRoutes = filterAsyncRouter(route.menu) // 对路由格式进行处理
      console.log('----------')
      console.log(asyncRoutes)

      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // }
      // else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, route.roles)
      console.log(accessedRoutes)
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
