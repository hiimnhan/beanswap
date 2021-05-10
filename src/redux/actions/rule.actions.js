import { RuleConstants } from '../constants';

const getRulesRequest = (query) => ({
  type: RuleConstants.GET_RULES_REQUEST,
  payload: query,
});

const getRulesSuccess = (rules) => ({
  type: RuleConstants.GET_RULES_SUCCESS,
  payload: rules,
});

const getRulesFailure = (error) => ({
  type: RuleConstants.GET_RULES_FAILURE,
  payload: error,
});

export const RuleActions = {
  getRulesRequest,
  getRulesSuccess,
  getRulesFailure,
};
