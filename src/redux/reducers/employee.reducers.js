import produce from 'immer';

import { EmployeeConstants } from '../constants';

const INITIAL_STATE = {
  employeeInfo: {},
  currentEmployeeId: '',
  loading: false,
  error: '',
  employeeList: [],
  processing: false,
  success: false,
  bonuses: {},
  bonusLoading: false,
};

export const employeeReducer = (state = INITIAL_STATE, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case EmployeeConstants.GET_EMPLOYEE_BY_ID_REQUEST:
        draft.loading = true;
        break;
      case EmployeeConstants.GET_EMPLOYEE_BY_ID_SUCCESS:
        draft.loading = false;
        draft.employeeInfo = action.payload;
        draft.currentEmployeeId = action.payload.id;
        break;
      case EmployeeConstants.GET_EMPLOYEE_BY_ID_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case EmployeeConstants.GET_EMPLOYEES_REQUEST:
        draft.loading = true;
        break;
      case EmployeeConstants.GET_EMPLOYEES_SUCCESS:
        draft.loading = false;
        draft.employeeList = action.payload;
        break;
      case EmployeeConstants.GET_EMPLOYEES_FAILURE:
        draft.error = action.payload;
        draft.loading = false;
        break;
      case EmployeeConstants.TOGGLE_EMPLOYEE_STATUS_REQUEST:
        draft.processing = true;
        break;
      case EmployeeConstants.TOGGLE_EMPLOYEE_STATUS_SUCCESS:
        draft.processing = false;
        break;
      case EmployeeConstants.TOGGLE_EMPLOYEE_STATUS_FAILURE:
        draft.error = action.payload;
        draft.processing = false;
        break;
      case EmployeeConstants.ADD_EMPLOYEE_REQUEST:
        draft.success = true;
        break;
      case EmployeeConstants.ADD_EMPLOYEE_SUCCESS:
        draft.success = false;
        break;
      case EmployeeConstants.ADD_EMPLOYEE_FAILURE:
        draft.success = false;
        draft.error = action.payload;
        break;
      case EmployeeConstants.GET_EMPLOYEE_BONUSES_REQUEST:
        draft.bonusLoading = true;
        break;
      case EmployeeConstants.GET_EMPLOYEE_BONUSES_SUCCESS:
        draft.bonusLoading = false;
        draft.bonuses = action.payload;
        break;
      case EmployeeConstants.GET_EMPLOYEE_BONUSES_FAILURE:
        draft.bonusLoading = false;
        draft.error = action.payload;
        break;
      case EmployeeConstants.DOWNLOAD_EMPLOYEES_REQUEST:
        draft.loading = true;
        break;
      case EmployeeConstants.DOWNLOAD_EMPLOYEES_SUCCESS:
        draft.loading = false;
        break;
      case EmployeeConstants.DOWNLOAD_EMPLOYEES_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      default:
        return draft;
    }
  });
