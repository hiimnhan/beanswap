import { VoucherConstants } from '../constants';

const getVouchersRequest = (query) => ({
  type: VoucherConstants.GET_VOUCHERS_REQUEST,
  payload: query,
});

const getVoucherSuccess = (voucherList) => ({
  type: VoucherConstants.GET_VOUCHERS_SUCCESS,
  payload: voucherList,
});

const getVouchersFailure = (error) => ({
  type: VoucherConstants.GET_VOUCHERS_FAILURE,
  payload: error,
});

const getVoucherByIdRequest = (id) => ({
  type: VoucherConstants.GET_VOUCHER_BY_ID_REQUEST,
  payload: id,
});

const getVoucherByIdSuccess = (voucher) => ({
  type: VoucherConstants.GET_VOUCHER_BY_ID_SUCCESS,
  payload: voucher,
});

const getVoucherByIdFailure = (error) => ({
  type: VoucherConstants.GET_VOUCHER_BY_ID_FAILURE,
  payload: error,
});

const deleteVoucherRequest = (id, query) => ({
  type: VoucherConstants.DELETE_VOUCHER_REQUEST,
  payload: { id, query },
});

const deleteVoucherSuccess = () => ({
  type: VoucherConstants.DELETE_VOUCHER_SUCCESS,
});

const deleteVoucherFailure = (error) => ({
  type: VoucherConstants.DELETE_VOUCHER_FAILURE,
  payload: error,
});

const getRedemptionRequest = (query) => ({
  type: VoucherConstants.GET_REDEMPTION_REQUEST,
  payload: query,
});

const getRedemptionSuccess = (redemptions) => ({
  type: VoucherConstants.GET_REDEMPTION_SUCCESS,
  payload: redemptions,
});

const getRedemptionFailure = (error) => ({
  type: VoucherConstants.GET_REDEMPTION_FAILURE,
  payload: error,
});

const addVoucherRequest = (data) => ({
  type: VoucherConstants.ADD_VOUCHER_REQUEST,
  payload: data,
});

const addVoucherSuccess = () => ({
  type: VoucherConstants.ADD_VOUCHER_SUCCESS,
});

const addVoucherFailure = (error) => ({
  type: VoucherConstants.ADD_VOUCHER_FAILURE,
  payload: error,
});

const downloadVouchersRequest = () => ({
  type: VoucherConstants.DOWNLOAD_VOUCHERS_REQUEST,
});

const downloadVouchersSuccess = () => ({
  type: VoucherConstants.DOWNLOAD_VOUCHERS_SUCCESS,
});

const downloadVouchersFailure = (error) => ({
  type: VoucherConstants.DOWNLOAD_VOUCHERS_FAILURE,
  payload: error,
});

export const VoucherActions = {
  getVouchersRequest,
  getVoucherSuccess,
  getVouchersFailure,

  getVoucherByIdRequest,
  getVoucherByIdSuccess,
  getVoucherByIdFailure,

  deleteVoucherRequest,
  deleteVoucherSuccess,
  deleteVoucherFailure,

  getRedemptionRequest,
  getRedemptionSuccess,
  getRedemptionFailure,

  addVoucherRequest,
  addVoucherSuccess,
  addVoucherFailure,

  downloadVouchersRequest,
  downloadVouchersSuccess,
  downloadVouchersFailure,
};
