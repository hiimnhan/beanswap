import produce from 'immer';

import { BrandConstants } from '../constants';

const INITIAL_STATE = {
  brandList: [],
  loading: false,
  error: null,
  currentBrandId: '',
  currentBrand: {},
  balance: 0,
  invoices: {},
};

export const brandReducer = (state = INITIAL_STATE, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case BrandConstants.GET_BRAND_BY_CLAIM_REQUEST:
        draft.loading = true;
        break;
      case BrandConstants.GET_BRAND_BY_CLAIM_SUCCESS:
        draft.loading = false;
        draft.brandList = action.payload;
        break;
      case BrandConstants.GET_BRAND_BY_CLAIM_FAILURE:
        draft.error = action.payload;
        draft.loading = false;
        break;
      case BrandConstants.GET_BRAND_BY_ID_REQUEST:
        draft.loading = true;
        break;
      case BrandConstants.GET_BRAND_BY_ID_SUCCESS:
        draft.loading = false;
        draft.currentBrandId = action.payload.id;
        draft.currentBrand = action.payload;
        break;
      case BrandConstants.GET_BRAND_BY_ID_FAILURE:
        draft.error = action.payload;
        break;
      case BrandConstants.GET_BALANCE_REQUEST:
        draft.loading = true;
        break;
      case BrandConstants.GET_BALANCE_SUCCESS:
        draft.loading = false;
        draft.balance = action.payload.balance;
        break;
      case BrandConstants.GET_BALANCE_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case BrandConstants.GET_INVOICES_REQUEST:
        draft.loading = true;
        break;
      case BrandConstants.GET_INVOICES_SUCCESS:
        draft.loading = false;
        draft.invoices = action.payload;
        break;
      case BrandConstants.GET_INVOICES_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      default:
        return draft;
    }
  });
