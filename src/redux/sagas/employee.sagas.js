import { message } from 'antd';
import FileSaver from 'file-saver';
import moment from 'moment';
import { put, takeEvery } from 'redux-saga/effects';

import http from '../../configs/axios';
import { EMPLOYEE_FILE_FORMAT, FILE_DATE_FORMAT } from '../../constants/format';
import {
  BRAND_ID_LOCALSTORAGE,
  EXCEL_CONTENT_TYPE,
} from '../../constants/service';
import { getItemLocalStorage } from '../../utils/storage.utils';
import { EmployeeActions } from '../actions/employee.actions';

import { EmployeeConstants } from '../constants';
const queryString = require('query-string');

function* getEmployeeById({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      userId: payload,
      brandId,
    });

    const { data } = yield http.get(`/employees?${query}`, {
      headers: {
        brandId,
      },
    });
    yield put(EmployeeActions.getEmployeeByIdSuccess(data.data[0]));
  } catch (error) {
    yield put(EmployeeActions.getEmployeeByIdFailure(error));
  }
}

function* getEmployees({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      brandId,
      fields: 'stores',
      ...payload,
    });
    const { data } = yield http.get(`/employees?${query}`, {
      headers: {
        brandId,
      },
    });

    yield put(EmployeeActions.getEmployeesSuccess(data));
  } catch (error) {
    yield put(EmployeeActions.getEmployeesFailure(error));
  }
}

function* toggleEmployeeStatus({ payload }) {
  try {
    const { item: employee, query } = payload;
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);

    const formData = new FormData();

    formData.append('status', !!employee.status ? 0 : 1);

    formData.append('code', employee.code);
    formData.append('firstName', employee.firstName);
    formData.append('lastName', employee.lastName);
    formData.append('birthDate', employee.birthDate);
    formData.append('address', employee.address);
    formData.append('region', 'VN');
    formData.append('phoneNumber', employee.phoneNumber);
    formData.append('email', employee.email);
    formData.append('isBrandAdmin', !!employee.isBrandAdmin);
    if (employee.stores.length > 0) {
      employee.stores.forEach((s, index) => {
        formData.append(`stores[${index}].storeId`, s.store.id);
        formData.append(`stores[${index}].isManager`, s.isManager);
        formData.append(`stores[${index}].status`, s.status);
      });
    }

    yield http.put(`/employees/${employee.id}`, formData, {
      headers: {
        brandId,
      },
    });
    yield put(EmployeeActions.toggleEmployeeStatusSuccess());
    message.success('Modify employee successfully!');
    yield put(EmployeeActions.getEmployeesRequest(query));
  } catch (error) {
    yield put(EmployeeActions.toggleEmployeeStatusFailure(error));
    message.error('Something went wrong when delete employee!');
  }
}

function* addEmployee({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    yield http.post('/employees', payload, {
      headers: {
        brandId,
      },
    });
    yield put(EmployeeActions.addEmployeeSuccess());
    message.success('Add employee succesfully');
    yield put(
      EmployeeActions.getEmployeesRequest({
        pageSize: 10,
        pageIndex: 1,
      })
    );
  } catch (error) {
    yield put(EmployeeActions.addEmployeeFailure(error));
    message.error('Error when add employee');
  }
}

function* getEmployeeBonuses() {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      fields: 'sender,receivers',
      brandId,
      sort: 'createdDate desc',
      type: 3,
    });
    const { data } = yield http.get(`/bonuses?${query}`, {
      headers: {
        brandId,
      },
    });
    yield put(EmployeeActions.getEmployeeBonusesSuccess(data));
  } catch (error) {
    yield put(EmployeeActions.getEmployeeBonusesFailure(error));
  }
}

export function* downloadEmployees() {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      brandId,
      fields: 'stores',
    });
    const { data } = yield http.get(`/employees?${query}`, {
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
      `${EMPLOYEE_FILE_FORMAT}_${moment().format(FILE_DATE_FORMAT)}.xlsx`
    );
    yield put(EmployeeActions.downloadEmployeesSuccess());
  } catch (error) {
    yield put(EmployeeActions.downloadEmployeesFailure(error));
  }
}

export function* employeeSaga() {
  yield takeEvery(
    EmployeeConstants.GET_EMPLOYEE_BY_ID_REQUEST,
    getEmployeeById
  );
  yield takeEvery(EmployeeConstants.GET_EMPLOYEES_REQUEST, getEmployees);
  yield takeEvery(
    EmployeeConstants.TOGGLE_EMPLOYEE_STATUS_REQUEST,
    toggleEmployeeStatus
  );
  yield takeEvery(EmployeeConstants.ADD_EMPLOYEE_REQUEST, addEmployee);
  yield takeEvery(
    EmployeeConstants.GET_EMPLOYEE_BONUSES_REQUEST,
    getEmployeeBonuses
  );
  yield takeEvery(
    EmployeeConstants.DOWNLOAD_EMPLOYEES_REQUEST,
    downloadEmployees
  );
}
