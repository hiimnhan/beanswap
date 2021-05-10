import produce from 'immer';
import { VoucherConstants } from '../constants';

const INITIAL_STATE = {
  voucherList: {},
  loading: false,
  error: null,
  voucherInfo: null,
  redemptions: {},
  processing: false,
};

export const voucherReducer = (state = INITIAL_STATE, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case VoucherConstants.GET_VOUCHERS_REQUEST:
        draft.loading = true;
        break;
      case VoucherConstants.GET_VOUCHERS_SUCCESS:
        draft.loading = false;

        draft.voucherList = action.payload;
        break;
      case VoucherConstants.GET_VOUCHERS_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case VoucherConstants.GET_VOUCHER_BY_ID_REQUEST:
        draft.loading = true;
        break;
      case VoucherConstants.GET_VOUCHER_BY_ID_SUCCESS:
        draft.loading = false;
        draft.voucher = action.payload;
        break;
      case VoucherConstants.GET_VOUCHER_BY_ID_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case VoucherConstants.DELETE_VOUCHER_REQUEST:
        draft.loading = true;
        break;
      case VoucherConstants.DELETE_VOUCHER_SUCCESS:
        draft.loading = false;
        draft.success = true;
        break;
      case VoucherConstants.DELETE_VOUCHER_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case VoucherConstants.GET_REDEMPTION_REQUEST:
        draft.loading = true;
        break;
      case VoucherConstants.GET_REDEMPTION_SUCCESS:
        draft.loading = false;
        draft.redemptions = action.payload;
        break;
      case VoucherConstants.GET_REDEMPTION_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case VoucherConstants.ADD_VOUCHER_REQUEST:
        draft.processing = true;
        break;
      case VoucherConstants.ADD_VOUCHER_SUCCESS:
        draft.processing = false;
        break;
      case VoucherConstants.ADD_VOUCHER_FAILURE:
        draft.processing = false;
        draft.error = action.payload;
        break;
      case VoucherConstants.DOWNLOAD_VOUCHERS_REQUEST:
        draft.loading = true;
        break;
      case VoucherConstants.DOWNLOAD_VOUCHERS_SUCCESS:
        draft.loading = false;
        break;
      case VoucherConstants.DOWNLOAD_VOUCHERS_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      default:
        return draft;
    }
  });
