import { combineReducers } from 'redux';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/es/storage';

import authReducer from './reducers/auth.reducers';
import { brandReducer } from './reducers/brand.reducers';
import { employeeReducer } from './reducers/employee.reducers';
import { ruleReducer } from './reducers/rule.reducers';
import { storeReducer } from './reducers/store.reducers';
import { voucherReducer } from './reducers/voucher.reducers';

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  blacklist: ['loading', 'error'],
};

const brandPersistConfig = {
  key: 'brand',
  storage: storage,
  whitelist: ['brandList', 'currentBrand'],
};

const employeePersistConfig = {
  key: 'employee',
  storage: storage,
  whitelist: ['currentEmployeeId', 'employeeInfo'],
};

export const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  brand: persistReducer(brandPersistConfig, brandReducer),
  store: storeReducer,
  voucher: voucherReducer,
  rule: ruleReducer,
  employee: persistReducer(employeePersistConfig, employeeReducer),
});
