import { StoreConstants } from '../constants';

const addStoreRequest = (code, photo, name, address) => {
  return {
    type: StoreConstants.ADD_STORE_REQUEST,
    payload: { code, photo, name, address },
  };
};

const addStoreSuccess = () => ({
  type: StoreConstants.ADD_STORE_SUCCESS,
});

const addStoreFailure = (error) => ({
  type: StoreConstants.ADD_STORE_FAILURE,
  payload: error,
});

const getStoresRequest = (query) => ({
  type: StoreConstants.GET_STORE_LIST_REQUEST,
  payload: query,
});

const getStoresSuccess = (storeList) => ({
  type: StoreConstants.GET_STORE_LIST_SUCCESS,
  payload: storeList,
});

const getStoresFailure = (error) => ({
  type: StoreConstants.GET_STORE_LIST_FAILURE,
  payload: error,
});

const deleteStoreRequest = (id, query) => ({
  type: StoreConstants.DELETE_STORE_REQUEST,
  payload: { id, query },
});

const deleteStoreSuccess = () => ({
  type: StoreConstants.DELETE_STORE_SUCCESS,
});

const deleteStoreFailure = (error) => ({
  type: StoreConstants.DELETE_STORE_ERROR,
  payload: error,
});

const getStoreBonusRequest = (query) => ({
  type: StoreConstants.GET_STORE_BONUS_REQUEST,
  payload: query,
});

const getStoreBonusSuccess = (bonuses) => ({
  type: StoreConstants.GET_STORE_BONUS_SUCCESS,
  payload: bonuses,
});

const getStoreBonusFailure = (error) => ({
  type: StoreConstants.GET_STORE_BONUS_FAILURE,
  payload: error,
});

const downloadStoresRequest = () => ({
  type: StoreConstants.DOWNLOAD_STORES_REQUEST,
});

const downloadStoresSuccess = () => ({
  type: StoreConstants.DOWNLOAD_STORES_SUCCESS,
});

const downloadStoresFailure = (error) => ({
  type: StoreConstants.DOWNLOAD_STORES_FAILURE,
  payload: error,
});

const addEmployeeToStoreRequest = (data) => ({
  type: StoreConstants.ADD_EMPLOYEE_TO_STORE_REQUEST,
  payload: data,
});

const addEmployeeToStoreSuccess = () => ({
  type: StoreConstants.ADD_EMPLOYEE_TO_STORE_SUCCESS,
});

const addEmployeeToStoreFailure = (error) => ({
  type: StoreConstants.ADD_EMPLOYEE_TO_STORE_FAILURE,
  payload: error,
});

export const StoreActions = {
  addStoreRequest,
  addStoreSuccess,
  addStoreFailure,

  getStoresRequest,
  getStoresSuccess,
  getStoresFailure,

  deleteStoreRequest,
  deleteStoreSuccess,
  deleteStoreFailure,

  getStoreBonusRequest,
  getStoreBonusSuccess,
  getStoreBonusFailure,

  downloadStoresRequest,
  downloadStoresSuccess,
  downloadStoresFailure,

  addEmployeeToStoreRequest,
  addEmployeeToStoreSuccess,
  addEmployeeToStoreFailure,
};
