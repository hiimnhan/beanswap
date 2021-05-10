import { all } from 'redux-saga/effects';

import authSaga from './sagas/auth.sagas';
import { brandSaga } from './sagas/brand.sagas';
import { employeeSaga } from './sagas/employee.sagas';
import { ruleSaga } from './sagas/rule.sagas';
import storeSaga from './sagas/store.sagas';
import { voucherSaga } from './sagas/voucher.sagas';

export default function* rootSaga() {
  yield all([
    authSaga(),
    brandSaga(),
    storeSaga(),
    employeeSaga(),
    voucherSaga(),
    ruleSaga(),
  ]);
}
