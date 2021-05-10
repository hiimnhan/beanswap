import { EmployeeConstants } from '../constants';

const getEmployeeByIdRequest = (id) => ({
  type: EmployeeConstants.GET_EMPLOYEE_BY_ID_REQUEST,
  payload: id,
});

const getEmployeeByIdSuccess = (employeeInfo) => ({
  type: EmployeeConstants.GET_EMPLOYEE_BY_ID_SUCCESS,
  payload: employeeInfo,
});

const getEmployeeByIdFailure = (error) => ({
  type: EmployeeConstants.GET_EMPLOYEE_BY_ID_FAILURE,
  payload: error,
});

const getEmployeesRequest = (query) => ({
  type: EmployeeConstants.GET_EMPLOYEES_REQUEST,
  payload: query,
});

const getEmployeesSuccess = (employeeList) => ({
  type: EmployeeConstants.GET_EMPLOYEES_SUCCESS,
  payload: employeeList,
});

const getEmployeesFailure = (error) => ({
  type: EmployeeConstants.GET_EMPLOYEES_FAILURE,
  payload: error,
});

const toggleEmployeeStatusRequest = (item, query) => ({
  type: EmployeeConstants.TOGGLE_EMPLOYEE_STATUS_REQUEST,
  payload: { item, query },
});

const toggleEmployeeStatusSuccess = () => ({
  type: EmployeeConstants.TOGGLE_EMPLOYEE_STATUS_SUCCESS,
});

const toggleEmployeeStatusFailure = (error) => ({
  type: EmployeeConstants.TOGGLE_EMPLOYEE_STATUS_FAILURE,
  payload: error,
});

const addEmployeeRequest = (data) => ({
  type: EmployeeConstants.ADD_EMPLOYEE_REQUEST,
  payload: data,
});

const addEmployeeSuccess = () => ({
  type: EmployeeConstants.ADD_EMPLOYEE_SUCCESS,
});

const addEmployeeFailure = (error) => ({
  type: EmployeeConstants.ADD_EMPLOYEE_FAILURE,
  payload: error,
});

const getEmployeeBonusesRequest = () => ({
  type: EmployeeConstants.GET_EMPLOYEE_BONUSES_REQUEST,
});

const getEmployeeBonusesSuccess = (bonuses) => ({
  type: EmployeeConstants.GET_EMPLOYEE_BONUSES_SUCCESS,
  payload: bonuses,
});

const getEmployeeBonusesFailure = (error) => ({
  type: EmployeeConstants.GET_EMPLOYEE_BONUSES_FAILURE,
  payload: error,
});

const downloadEmployeesRequest = () => ({
  type: EmployeeConstants.DOWNLOAD_EMPLOYEES_REQUEST,
});

const downloadEmployeesSuccess = () => ({
  type: EmployeeConstants.DOWNLOAD_EMPLOYEES_SUCCESS,
});

const downloadEmployeesFailure = (error) => ({
  type: EmployeeConstants.DOWNLOAD_EMPLOYEES_FAILURE,
  payload: error,
});

export const EmployeeActions = {
  getEmployeeByIdRequest,
  getEmployeeByIdSuccess,
  getEmployeeByIdFailure,

  getEmployeesRequest,
  getEmployeesSuccess,
  getEmployeesFailure,

  toggleEmployeeStatusRequest,
  toggleEmployeeStatusSuccess,
  toggleEmployeeStatusFailure,

  addEmployeeRequest,
  addEmployeeSuccess,
  addEmployeeFailure,

  getEmployeeBonusesRequest,
  getEmployeeBonusesSuccess,
  getEmployeeBonusesFailure,

  downloadEmployeesRequest,
  downloadEmployeesSuccess,
  downloadEmployeesFailure,
};
