import produce from 'immer';

import { StoreConstants } from '../constants';

const INITIAL_VALUES = {
  processing: false,
  error: null,
  success: false,
  storeList: {},
  loading: false,
  bonuses: {},
  bonusLoading: false,
  addLoading: false,
};

export const storeReducer = (state = INITIAL_VALUES, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case StoreConstants.ADD_STORE_REQUEST:
        draft.processing = true;
        break;
      case StoreConstants.ADD_STORE_SUCCESS:
        draft.processing = false;
        draft.success = true;
        break;
      case StoreConstants.ADD_STORE_FAILURE:
        draft.processing = false;
        draft.success = false;
        draft.error = action.payload;
        break;
      case StoreConstants.GET_STORE_LIST_REQUEST:
        draft.loading = true;
        break;
      case StoreConstants.GET_STORE_LIST_SUCCESS:
        draft.loading = false;
        draft.storeList = action.payload;
        break;
      case StoreConstants.GET_STORE_LIST_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case StoreConstants.DELETE_STORE_REQUEST:
        draft.processing = true;
        break;
      case StoreConstants.DELETE_STORE_SUCCESS:
        draft.processing = false;
        break;
      case StoreConstants.DELETE_STORE_FAILURE:
        draft.processing = false;
        draft.error = action.payload;
        break;
      case StoreConstants.GET_STORE_BONUS_REQUEST:
        draft.bonusLoading = true;
        break;
      case StoreConstants.GET_STORE_BONUS_SUCCESS:
        draft.bonusLoading = false;
        draft.bonuses = action.payload;
        break;
      case StoreConstants.GET_STORE_BONUS_FAILURE:
        draft.bonusLoading = false;
        draft.error = action.payload;
        break;
      case StoreConstants.DOWNLOAD_STORES_REQUEST:
        draft.loading = true;
        break;
      case StoreConstants.DOWNLOAD_STORES_SUCCESS:
        draft.loading = false;
        break;
      case StoreConstants.DOWNLOAD_STORES_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case StoreConstants.ADD_EMPLOYEE_TO_STORE_REQUEST:
        draft.addLoading = true;
        break;
      case StoreConstants.ADD_EMPLOYEE_TO_STORE_SUCCESS:
        draft.addLoading = false;
        break;
      case StoreConstants.ADD_EMPLOYEE_TO_STORE_FAILURE:
        draft.addLoading = false;
        draft.error = action.payload;
        break;
      default:
        return draft;
    }
  });
