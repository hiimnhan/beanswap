import { BrandConstants } from '../constants';

const getBrandByClaimRequest = () => {
  return {
    type: BrandConstants.GET_BRAND_BY_CLAIM_REQUEST,
  };
};

const getBrandByClaimSuccess = (data) => {
  return {
    type: BrandConstants.GET_BRAND_BY_CLAIM_SUCCESS,
    payload: data,
  };
};

const getBrandByClaimFailure = (error) => {
  return {
    type: BrandConstants.GET_BRAND_BY_CLAIM_FAILURE,
    payload: error,
  };
};

const getBrandByIdRequest = (brandId, query) => {
  return {
    type: BrandConstants.GET_BRAND_BY_ID_REQUEST,
    payload: { brandId, query },
  };
};

const getBrandByIdSuccess = (brandInfo) => {
  return {
    type: BrandConstants.GET_BRAND_BY_ID_SUCCESS,
    payload: brandInfo,
  };
};

const getBrandByIdFailure = (error) => {
  return {
    type: BrandConstants.GET_BRAND_BY_ID_FAILURE,
    payload: error,
  };
};

const getBalanceRequest = (walletAddress) => ({
  type: BrandConstants.GET_BALANCE_REQUEST,
  payload: walletAddress,
});

const getBalanceSuccess = (balance) => ({
  type: BrandConstants.GET_BALANCE_SUCCESS,
  payload: balance,
});

const getBalanceFailure = (error) => ({
  type: BrandConstants.GET_BALANCE_FAILURE,
  payload: error,
});

const getInvoicesRequest = (query) => ({
  type: BrandConstants.GET_INVOICES_REQUEST,
  payload: query,
});

const getInvoicesSuccess = (invoices) => ({
  type: BrandConstants.GET_INVOICES_SUCCESS,
  payload: invoices,
});

const getInvoicesFailure = (error) => ({
  type: BrandConstants.GET_INVOICES_FAILURE,
  payload: error,
});

export const BrandActions = {
  getBrandByClaimRequest,
  getBrandByClaimSuccess,
  getBrandByClaimFailure,

  getBrandByIdRequest,
  getBrandByIdSuccess,
  getBrandByIdFailure,

  getBalanceRequest,
  getBalanceSuccess,
  getBalanceFailure,

  getInvoicesRequest,
  getInvoicesSuccess,
  getInvoicesFailure,
};
