import { put, takeEvery } from '@redux-saga/core/effects';
import http from '../../configs/axios';
import { BRAND_ID_LOCALSTORAGE } from '../../constants/service';
import { getItemLocalStorage } from '../../utils/storage.utils';
import { RuleActions } from '../actions/rule.actions';
import { RuleConstants } from '../constants';
const queryString = require('querystring');
function* getRules({ payload }) {
  try {
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      ...payload,
      sort: 'createdDate desc',
      fields: 'stores',
      brandId,
    });
    const { data } = yield http.get(`/rules?${query}`, {
      headers: {
        brandId,
      },
    });
    yield put(RuleActions.getRulesSuccess(data));
  } catch (error) {
    yield put(RuleActions.getRulesFailure(error));
  }
}

export function* ruleSaga() {
  yield takeEvery(RuleConstants.GET_RULES_REQUEST, getRules);
}
