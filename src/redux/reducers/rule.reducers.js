import produce from 'immer';
import { RuleConstants } from '../constants';

const INITIAL_STATE = {
  ruleList: {},
  error: '',
  loading: false,
  ruleInfo: null,
};

export const ruleReducer = (state = INITIAL_STATE, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case RuleConstants.GET_RULES_REQUEST:
        draft.loading = true;
        break;
      case RuleConstants.GET_RULES_SUCCESS:
        draft.loading = false;
        draft.ruleList = action.payload;
        break;
      case RuleConstants.GET_RULES_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
      default:
        return draft;
    }
  });
