import { combineReducers } from 'redux';
import lang from '@reducers/lang';

import { CLEAR, RESET_PAGE } from '@actions/common';

const createAppReducers = reducers => {
  return combineReducers({
      lang,
      ...reducers
  })
};

export const createRootReducer = appReducers => (state = {}, action) => {

  if (action.type === CLEAR) {
        delete state[action.payload.entityGroup].entities[action.payload.entityKey];
        delete state[action.payload.entityGroup].apiStatus[action.payload.entityKey];
  } else if(action.type === RESET_PAGE){
        state[action.payload.entityGroup].page = 1;
  }

  return createAppReducers(appReducers)(state, action);
}
