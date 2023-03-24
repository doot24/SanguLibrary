import { createStore } from 'vuex'
import { getApiConnectionString } from '@/assets/js/utils';

import axios from 'axios';

export default createStore({
  state: {
    user: null
  },
  getters: {
    GetUser(state) {
      return state.user;
    }
  },
  mutations: {
    SetUser(state, user) {
      state.user = user
    }
  },
  actions: {
    async Login({ commit }, credentials) {
      try {
        axios.defaults.withCredentials = true;

        const response = await axios.post(getApiConnectionString() + '/auth/login', { email: credentials.email, password: credentials.password });
        commit('SetUser', response.data.user)
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async Logout({ commit }) {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.post(getApiConnectionString() + '/auth/logout');
        commit('SetUser', null)
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async GetProfile({ commit }) {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(getApiConnectionString() + '/user/profile');
        commit('SetUser', response.data.user)
        return response.data.user;
      } catch (error) {
        throw error;
      }
    }
  },
  modules: {
  },
})
