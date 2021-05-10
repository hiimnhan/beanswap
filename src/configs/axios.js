import axios from 'axios';

import { BASE_URL, BRAND_ID_LOCALSTORAGE } from '../constants/service';
import { AuthActions } from '../redux/actions/auth.actions';
import { auth } from './firebase';
import { store } from '../redux/store';
import { getItemLocalStorage } from '../utils/storage.utils';

const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    brandId,
  },
});

instance.interceptors.request.use(async (config) => {
  const { dispatch } = store;
  try {
    const idToken = store.getState().auth.idToken;
    const expirationTime = store.getState().auth.expirationTime;
    const email = store.getState().auth.email;
    const expirationDate = new Date(expirationTime).getTime();
    const now = new Date().getTime();
    if (expirationDate > now) {
      config.headers.Authorization = 'Bearer ' + idToken;
    } else {
      const newIdToken = await auth.currentUser.getIdTokenResult();
      dispatch(
        AuthActions.loginSuccess(
          newIdToken.token,
          auth.currentUser.uid,
          newIdToken.expirationTime,
          newIdToken.claims,
          email
        )
      );
      config.headers.Authorization = 'Bearer ' + newIdToken.token;
    }
  } catch (err) {
    dispatch(AuthActions.logout());
  }
  return config;
});

export default instance;
