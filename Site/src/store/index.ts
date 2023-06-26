import { createStore, Store } from 'vuex';
import { getApiConnectionString } from '@/assets/js/utils';
import axios, { AxiosResponse } from 'axios';

import { User } from "../interfaces/User"

interface State {
  user: User | null;
  authenticated : Boolean,
  activeInfo : {}
  
}

interface Credentials {
  email: string;
  password: string;
}

interface ResponseData {
  user: User;
}

const store: Store<State> = createStore({
  state: {
    user: null,
    authenticated: false,
    activeInfo : {}
  },
  getters: {
    GetUser(state: State): User | null {
      return state.user;
    },
    GetAuthenticated(state: State): Boolean {
      return state.authenticated;
    },
    GetActiveInfo(state: State): {} {
      return state.activeInfo;
    }
  },
  mutations: {
    SetUser(state: State, user: User | null): void {
      state.user = user;
    },
    SetAuthentication(state: State, loginstate: boolean): void {
      state.authenticated = loginstate;
    },
    SetActiveInfo(state: State, activeinfo: boolean): void {
      state.activeInfo = activeinfo;
    }
  },
  actions: {
    async Login({ commit }: { commit: Function }, credentials: Credentials): Promise<ResponseData> {
      try {
        axios.defaults.withCredentials = true;

        const response: AxiosResponse<ResponseData> = await axios.post(getApiConnectionString() + '/auth/login', { email: credentials.email, password: credentials.password });
        commit('SetUser', response.data.user);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async Logout({ commit }: { commit: Function }): Promise<ResponseData> {
      try {
        axios.defaults.withCredentials = true;
        const response: AxiosResponse<ResponseData> = await axios.post(getApiConnectionString() + '/auth/logout');
        commit('SetUser', null);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async GetProfile({ commit }: { commit: Function }): Promise<any> {
      try {
        axios.defaults.withCredentials = true;
        const response: AxiosResponse<ResponseData> = await axios.get(getApiConnectionString() + '/user/profile');
        commit('SetUser', response.data.user);
        return response.data.user;
      } catch (error) {
        throw error;
      }
    },
    async GetActive({ commit }: { commit: Function }): Promise<any> {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(getApiConnectionString() + '/user/active');
        commit('SetAuthentication', response.data.active);
        commit("SetActiveInfo",response.data);
        return response.data.active;
      } catch (error) {
        throw error;
      }
    }
  },
  modules: {
  },
});

export default store;
