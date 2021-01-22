
const tokens = {
  admin: {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ4c3BfYmIiLCJhdWQiOiJ4c3BfYmIiLCJpYXQiOjE2MTEzMDgwMTUsImV4cCI6MTYxMTkxMjgxNSwiZGF0YSI6eyJ1c2VyaWQiOiIxMjEzIiwidXNlcm5hbWUiOiJ6aGVuZ2h1YSIsInBpYyI6IiJ9fQ.tXDZCHa4NLVTfq1v4gQ2N44kW232Qr4jfZNwmUxi-OeWxQKtqiUIvgpiop42KWWZV2qb9N1dZzFerDupLUlXdzmf-IE1siq3XA5nU01pf2zsn_KPyyjNIq_zWX9gCrYZcvMkK3ohoR2veO7UAnQkztBFpv1VxOSSWpW0gHnbFnio6j6uTIILG3e8vOc2gyhS9IfyffZNJ2mJXy2XaZOFCicRISZuA46trhlHxrcOBlvRSAEmrU0f1N3RaALwJTyLhm7lQViWS1gOK36EoAt_wYcndZL2rbM_b65QYZxsATTyT7dgHpT0qFWZQltrxAwI9jev9Gq5Hs6kUTwBwomoJg'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ4c3BfYmIiLCJhdWQiOiJ4c3BfYmIiLCJpYXQiOjE2MTEzMDgwMTUsImV4cCI6MTYxMTkxMjgxNSwiZGF0YSI6eyJ1c2VyaWQiOiIxMjEzIiwidXNlcm5hbWUiOiJ6aGVuZ2h1YSIsInBpYyI6IiJ9fQ.tXDZCHa4NLVTfq1v4gQ2N44kW232Qr4jfZNwmUxi-OeWxQKtqiUIvgpiop42KWWZV2qb9N1dZzFerDupLUlXdzmf-IE1siq3XA5nU01pf2zsn_KPyyjNIq_zWX9gCrYZcvMkK3ohoR2veO7UAnQkztBFpv1VxOSSWpW0gHnbFnio6j6uTIILG3e8vOc2gyhS9IfyffZNJ2mJXy2XaZOFCicRISZuA46trhlHxrcOBlvRSAEmrU0f1N3RaALwJTyLhm7lQViWS1gOK36EoAt_wYcndZL2rbM_b65QYZxsATTyT7dgHpT0qFWZQltrxAwI9jev9Gq5Hs6kUTwBwomoJg': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
