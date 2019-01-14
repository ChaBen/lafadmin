import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '../feathers-client'

import app from './modules/app'
import user from './modules/user'
import getters from './getters'

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, { idField: 'id' })

Vue.use(Vuex)
Vue.use(FeathersVuex)

const store = new Vuex.Store({
  plugins: [
    service('users'),
    service('tickets'),
    service('press'),
    service('channel'),
    service('artists'),
    auth({
      userService: 'users'
    })
  ],
  modules: {
    app,
    user
  },
  getters
})

export default store
