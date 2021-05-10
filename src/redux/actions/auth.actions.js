import { AuthConstants } from '../constants';
import { persistor } from '../store';

const loginRequest = (email, password) => {
  return {
    type: AuthConstants.LOGIN_REQUEST,
    payload: { email, password },
  };
};

const loginSuccess = (idToken, localId, expirationTime, claims, email) => {
  return {
    type: AuthConstants.LOGIN_SUCCESS,
    payload: { idToken, localId, expirationTime, claims, email },
  };
};

const loginFailure = (error) => {
  return {
    type: AuthConstants.LOGIN_FAILURE,
    payload: error,
  };
};

const checkAutoLogout = () => {
  return {
    type: AuthConstants.CHECK_AUTO_LOGOUT,
  };
};

const logout = () => {
  persistor.purge();
  return {
    type: AuthConstants.LOGOUT,
  };
};

export const AuthActions = {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  checkAutoLogout,
};
