import Router from './router';
import loginForm from '../pages/home/loginup/login';
import registrationForm from '../pages/home/loginup/registration';
import error404 from '../pages/errors/error404';
import error500 from '../pages/errors/error500';
import {Store} from '../scripts/store';
import messengerPage from '../pages/home/main/messengerPage';
import profilePage from '../pages/home/profile/profilePage';
import {loadUserData} from '../pages/home/profile/api/meApi';
import {getChats} from '../pages/home/main/api/chats-api';

declare global {
  export type Keys<T extends Record<string, unknown>> = keyof T;
  export type Values<T extends Record<string, unknown>> = T[Keys<T>];
}

const defaultState = {};
const router = new Router('#app');
const store = new Store(defaultState);

window.router = router;

window.store = new Store({
  isLoading: false,
  loginError: null,
  user: null,
  selectedCard: null,
});

router.use('/', loginForm)
    .use('/sign-up', registrationForm)
    .use('*', error404)
    .use('/messenger', messengerPage, getChats)
    .use('/settings', profilePage, loadUserData)
    .use('/500', error500)
    .start();

window.onerror = (message) => {
  console.error('Global error caught:', message);
  store.set({errorCode: '500', errorMessage: message.toString()});
  router.go('/500');
};

window.onunhandledrejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  store.set({
    errorCode: '500',
    errorMessage: event.reason?.toString() || 'Unhandled rejection',
  });
  router.go('/500');
};
