import { put, takeEvery } from 'redux-saga/effects';

import { BrandConstants } from '../constants';
import { BrandActions } from '../actions/brand.actions';
import http from '../../configs/axios';
import axios from 'axios';
import { getItemLocalStorage } from '../../utils/storage.utils';
import { BLOCKCHAIN_URL, BRAND_ID_LOCALSTORAGE } from '../../constants/service';
const queryString = require('querystring');
function* getBrandsByClaim() {
  try {
    const { data } = yield http.get('/brands?onlyMine=true');
    const brandList = data.data;

    yield put(BrandActions.getBrandByClaimSuccess(brandList));
  } catch (error) {
    yield put(BrandActions.getBrandByClaimFailure(error));
  }
}

function* getBrandById({ payload }) {
  try {
    const query = queryString.stringify({
      ...payload.query,
    });
    const { data } = yield http.get(`/brands/${payload.brandId}?${query}`, {
      headers: {
        brandId: payload.brandId,
      },
    });
    yield put(BrandActions.getBrandByIdSuccess(data));
  } catch (error) {
    yield put(BrandActions.getBrandByIdFailure(error));
  }
}

function* getBalance({ payload }) {
  try {
    const { data } = yield axios.get(`${BLOCKCHAIN_URL}/balances/${payload}`);
    yield put(BrandActions.getBalanceSuccess(data));
  } catch (error) {
    yield put(BrandActions.getBalanceFailure(error));
  }
}

function* getInvoices({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      ...payload,
      sort: 'createdDate desc',
    });
    const { data } = yield http.get(`/invoices?${query}`, {
      headers: {
        brandId,
      },
    });
    yield put(BrandActions.getInvoicesSuccess(data));
  } catch (error) {
    yield put(BrandActions.getInvoicesFailure(error));
  }
}

export function* brandSaga() {
  yield takeEvery(BrandConstants.GET_BRAND_BY_CLAIM_REQUEST, getBrandsByClaim);
  yield takeEvery(BrandConstants.GET_BRAND_BY_ID_REQUEST, getBrandById);
  yield takeEvery(BrandConstants.GET_BALANCE_REQUEST, getBalance);
  yield takeEvery(BrandConstants.GET_INVOICES_REQUEST, getInvoices);
}
