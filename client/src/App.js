import React, { useContext, useEffect, useState } from 'react';
import { Context } from '.';
import './App.css';
import LoginForm from './components/LoginForm';
import { observer } from 'mobx-react-lite';
import UserService from './services/UserServices';

function App() {
  const { store } = useContext(Context);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

  //Получаем список всех юзеров
  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  if (store.isLoading) {
    return <div>Загрузка...</div>;
  }
  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />
        <button onClick={getUsers}>Получить список пользователей </button>
      </div>
    );
  }
  console.log(store.isAuth);
  return (
    <div className='App'>
      <h1>
        {store.isAuth
          ? `Пользователь авторизован ${store.user.email}`
          : 'АВТОРИЗУЙТЕСЬ'}
      </h1>
      <h2>{store.user.isActivated ? 'Аккаунт подтверждён напочте': 'Подтвердите аккаунт!!!'}</h2>
      <button onClick={() => store.logout()}>Выйти</button>

      <div>
        <button onClick={getUsers}>Получить список пользователей </button>
      </div>
      {users.map((user) => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  );
}

export default observer(App);
