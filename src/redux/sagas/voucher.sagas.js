import { put, takeEvery } from '@redux-saga/core/effects';
import { message } from 'antd';
import FileSaver from 'file-saver';
import moment from 'moment';
import http from '../../configs/axios';
import { FILE_DATE_FORMAT, VOUCHER_FILE_FORMAT } from '../../constants/format';
import {
  BRAND_ID_LOCALSTORAGE,
  EXCEL_CONTENT_TYPE,
} from '../../constants/service';
import { getItemLocalStorage } from '../../utils/storage.utils';
import { VoucherActions } from '../actions/voucher.actions';
import { VoucherConstants } from '../constants';
const queryString = require('querystring');
function* getVouchers({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      ...payload,
      brandId,
    });
    const { data } = yield http.get(`/vouchers?${query}`, {
      headers: {
        brandId,
      },
    });
    yield put(VoucherActions.getVoucherSuccess(data));
  } catch (error) {
    yield put(VoucherActions.getVouchersFailure(error));
  }
}

function* getVoucherById({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const { data } = http.get(`/vouchers/${payload}`, {
      headers: {
        brandId,
      },
    });
    yield put(VoucherActions.getVoucherByIdSuccess(data));
  } catch (error) {
    yield put(VoucherActions.getVoucherByIdFailure(error));
  }
}

function* deleteVoucher({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    yield http.delete(`/vouchers/${payload.id}`, {
      headers: {
        brandId,
      },
    });
    yield message.success('Delete voucher successfully');
    yield put(VoucherActions.getVouchersRequest(payload.query));
  } catch (error) {
    yield put(VoucherActions.deleteVoucherFailure(error));
    yield message.error('Delete voucher error: ', error.message);
  }
}

function* getRedemptions({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      ...payload,
      brandId,
    });
    const { data } = yield http.get(`/redemptions?${query}`, {
      headers: {
        brandId,
      },
    });
    yield put(VoucherActions.getRedemptionSuccess(data));
  } catch (error) {
    yield put(VoucherActions.getRedemptionFailure(error));
  }
}

function* addVoucher({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    yield http.post('/vouchers', payload, {
      headers: {
        brandId,
      },
    });
    yield put(VoucherActions.addVoucherSuccess());
    message.success('Add voucher successfully!');
    yield put(
      VoucherActions.getVouchersRequest({
        pageSize: 10,
        pageIndex: 1,
      })
    );
  } catch (error) {
    yield put(VoucherActions.addVoucherFailure(error));
    message.error('Error when add voucher!');
  }
}

function* downloadVouchers() {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      brandId,
    });
    const { data } = yield http.get(`/vouchers?${query}`, {
      headers: {
        brandId,
        'content-type': EXCEL_CONTENT_TYPE,
        Accept: EXCEL_CONTENT_TYPE,
      },
      responseType: 'arraybuffer',
    });
    const blob = new Blob([data], { type: EXCEL_CONTENT_TYPE });
    FileSaver.saveAs(
      blob,
      `${VOUCHER_FILE_FORMAT}_${moment().format(FILE_DATE_FORMAT)}.xlsx`
    );
    yield put(VoucherActions.downloadVouchersSuccess());
  } catch (error) {
    yield put(VoucherActions.downloadVouchersFailure(error));
  }
}

export function* voucherSaga() {
  yield takeEvery(VoucherConstants.GET_VOUCHERS_REQUEST, getVouchers);
  yield takeEvery(VoucherConstants.DELETE_VOUCHER_REQUEST, deleteVoucher);
  yield takeEvery(VoucherConstants.GET_VOUCHER_BY_ID_REQUEST, getVoucherById);
  yield takeEvery(VoucherConstants.GET_REDEMPTION_REQUEST, getRedemptions);
  yield takeEvery(VoucherConstants.ADD_VOUCHER_REQUEST, addVoucher);
  yield takeEvery(VoucherConstants.DOWNLOAD_VOUCHERS_REQUEST, downloadVouchers);
}
