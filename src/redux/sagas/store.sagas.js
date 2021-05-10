import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';

import { StoreConstants } from '../constants';
import { StoreActions } from '../actions/store.actions';
import { store } from '../store';
import http from '../../configs/axios';
import { getItemLocalStorage } from '../../utils/storage.utils';
import {
  BRAND_ID_LOCALSTORAGE,
  EXCEL_CONTENT_TYPE,
} from '../../constants/service';

import FileSaver from 'file-saver';
import moment from 'moment';
import { FILE_DATE_FORMAT, STORE_FILE_FORMAT } from '../../constants/format';

const queryString = require('query-string');

function* addStore({ payload }) {
  try {
    const brandId = store.getState().brand?.currentBrand?.id;
    const formData = new FormData();
    const params = payload.code;
    formData.append('code', params.code);
    formData.append('photo', params.photo);
    formData.append('name', params.name);
    formData.append('address', params.address);
    formData.append('brandId', brandId);
    yield http.post('/stores', formData, {
      headers: {
        brandId,
        'Content-Type': 'multipart/form-data',
      },
    });
    yield put(StoreActions.addStoreSuccess());
    yield put(StoreActions.getStoresRequest(1, 10));
    message.success('Add successfully.');
  } catch (error) {
    put(StoreActions.addStoreFailure(error));
    message.error('Something when wrong.');
  }
}

function* getStores({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      brandId,
      ...payload,
    });
    const { data } = yield http.get(`/stores?${query}`);

    yield put(StoreActions.getStoresSuccess(data));
  } catch (error) {
    put(StoreActions.getStoresFailure(error));
  }
}

function* deleteStore({ payload }) {
  try {
    const { id, query } = payload;
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    yield http.delete(`/stores/${id}`, {
      headers: {
        brandId,
      },
    });
    yield put(StoreActions.deleteStoreSuccess());
    yield put(StoreActions.getStoresRequest(query));
    message.success('Delete store successfully');
  } catch (error) {
    yield put(StoreActions.deleteStoreFailure(error));
    message.success('Something went wrong when delete store');
  }
}

function* getBonuses({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      ...payload,
      sort: 'createdDate desc',
    });
    const { data } = yield http.get(`/storebonuses?${query}`, {
      headers: {
        brandId,
      },
    });
    yield put(StoreActions.getStoreBonusSuccess(data));
  } catch (error) {
    yield put(StoreActions.getStoreBonusFailure(error));
  }
}

function* downloadStores() {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      brandId,
    });
    const { data } = yield http.get(`/stores?${query}`, {
      headers: {
        brandId,
        'content-type': EXCEL_CONTENT_TYPE,
        Accept: EXCEL_CONTENT_TYPE,
      },
      responseType: 'arraybuffer',
    });
    yield put(StoreActions.downloadStoresSuccess());
    const blob = new Blob([data], { type: EXCEL_CONTENT_TYPE });
    FileSaver.saveAs(
      blob,
      `${STORE_FILE_FORMAT}_${moment().format(FILE_DATE_FORMAT)}.xlsx`
    );
  } catch (error) {
    console.log('error', error);
    yield put(StoreActions.downloadStoresFailure(error));
  }
}

function* addEmployeeToStore({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    yield http.post(
      `/stores/${payload.storeId}/employees`,
      { ...payload },
      {
        headers: {
          brandId,
        },
      }
    );
    yield put(StoreActions.addEmployeeToStoreSuccess());
  } catch (error) {
    yield put(StoreActions.addEmployeeToStoreFailure(error));
  }
}

export default function* storeSaga() {
  yield takeEvery(StoreConstants.ADD_STORE_REQUEST, addStore);
  yield takeEvery(StoreConstants.GET_STORE_LIST_REQUEST, getStores);
  yield takeEvery(StoreConstants.DELETE_STORE_REQUEST, deleteStore);
  yield takeEvery(StoreConstants.GET_STORE_BONUS_REQUEST, getBonuses);
  yield takeLatest(StoreConstants.DOWNLOAD_STORES_REQUEST, downloadStores);
  yield takeEvery(
    StoreConstants.ADD_EMPLOYEE_TO_STORE_REQUEST,
    addEmployeeToStore
  );
}
