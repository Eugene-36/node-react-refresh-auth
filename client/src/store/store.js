import { makeAutoObservable } from 'mobx';
import AuthService from '../services/AuthService';
import { API_URL } from '../http/index.js'; //! Тут может возникнуть вопрос
import axios from 'axios';

export default class Store {
  user = {};
  isAuth = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }
  setAuth(boolean) {
    this.isAuth = boolean;
  }

  setUser(user) {
    this.user = user;
  }

  setLoading(boolean) {
    this.isLoading = boolean;
  }
  async login(email, password) {
    try {
      const response = await AuthService.login(email, password);
      console.log('response Login :', response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async registration(email, password) {
    try {
      const response = await AuthService.registration(email, password);
      console.log('response Registration:', response);

      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({});
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/refresh`, {
        withCredentials: true,
      });

      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.log(e.response?.data?.message);
    } finally {
      this.setLoading(false);
    }
  }
}
