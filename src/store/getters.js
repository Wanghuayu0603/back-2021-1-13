const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  roles: state => state.user.roles,
  menu: state => state.user.menu,
  permission_routes: state => state.permission.routes
}
export default getters
