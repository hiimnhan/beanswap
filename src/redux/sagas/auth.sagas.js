import { call, put, select, takeEvery } from 'redux-saga/effects';

import { AuthActions } from '../actions/auth.actions';
import { AuthConstants } from '../constants';
import { auth } from '../../configs/firebase';
import { BrandActions } from '../actions/brand.actions';

export function* login({ payload }) {
  try {
    const { email, password } = payload;
    const { user } = yield auth.signInWithEmailAndPassword(email, password);
    const tokenResult = yield user.getIdTokenResult();
    yield put(
      AuthActions.loginSuccess(
        tokenResult.token,
        user.uid,
        tokenResult.expirationTime,
        tokenResult.claims,
        email
      )
    );
    yield put(BrandActions.getBrandByClaimRequest());
  } catch (error) {
    yield put(AuthActions.loginFailure(error));
  }
}

export function* logout() {
  try {
    yield auth.signOut();
    window.localStorage.clear();
  } catch (error) {
    yield put(AuthActions.loginFailure(error.message));
  }
}

export function* checkAutoLogout() {
  try {
    const now = new Date().getTime();
    const expirationTime = yield select((state) => state.auth.expirationTime);
    const expirationDate = new Date(expirationTime).getTime();
    // const expirationDate = new Date().getTime() + 4000;
    if (now > expirationDate) {
      yield call(logout);
    }
  } catch (error) {
    yield put(AuthActions.loginFailure(error.message));
  }
}

export default function* authSaga() {
  yield takeEvery(AuthConstants.LOGIN_REQUEST, login);
  yield takeEvery(AuthConstants.LOGOUT, logout);
  yield takeEvery(AuthConstants.CHECK_AUTO_LOGOUT, checkAutoLogout);
}
