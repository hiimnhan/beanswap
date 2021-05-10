import produce from 'immer';

import { AuthConstants } from '../constants';

const INITIAL_STATE = {
  idToken: null,
  localId: null,
  expirationTime: null,
  email: null,
  claims: {},
  loading: false,
  error: null,
};

const authReducer = (state = INITIAL_STATE, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case AuthConstants.LOGIN_REQUEST:
        draft.loading = true;
        break;
      case AuthConstants.LOGIN_SUCCESS:
        draft.idToken = action.payload.idToken;
        draft.localId = action.payload.localId;
        draft.expirationTime = action.payload.expirationTime;
        draft.claims = action.payload.claims;
        draft.email = action.payload.email;
        draft.loading = false;
        break;
      case AuthConstants.LOGIN_FAILURE:
        draft.error = action.payload;
        draft.loading = false;
        break;
      case AuthConstants.LOGOUT:
        return INITIAL_STATE;
      default:
        return draft;
    }
  });

export default authReducer;
