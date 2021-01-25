import { login, logout, getAsyncRoutes } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    roles: [],
    menu: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROUTER: (state, menu) => {
    state.menu = menu
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {

      // login({ username: username.trim(), password: password }).then(response => {
      //   const { data } = response
      //   commit('SET_TOKEN', data.token)
      //   setToken(data.token)
      //   resolve(data)
      // }).catch(error => {
      //   console.log(error)
      //   reject(error)
      // })

      login(userInfo).then(response => {
        if (response.code == 200) {
          commit('SET_TOKEN', response.info.token)
          setToken(response.info.token)
        }
        resolve(response)

      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getAsyncRoutes ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAsyncRoutes(state.token).then(response => {
        if (response.code == 200) {

        }

        if (!response) {
          reject('Verification failed, please Login again.')
        }

        const { roles, menu } = response.info
        console.log(roles)
        console.log(menu)
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_ROUTER', menu)
        resolve(response.info)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
