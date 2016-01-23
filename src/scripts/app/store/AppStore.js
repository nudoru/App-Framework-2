/*
 Global Redux store

 Refer for details on middleware and async middleware
 https://medium.com/@meagle/understanding-87566abcfb7a#.1i0s2ov3h

 Look at
 https://github.com/acdlite/redux-promise
 https://github.com/acdlite/redux-rx
 */

import { createStore } from 'redux';
import ActionConstants from '../action/ActionConstants.js';
import NoriActionConstants from '../../nori/action/ActionConstants.js';

// Default state shape
const DEFAULT_STATE = {
  currentState: 'chillin',
  greeting    : 'Hello world!'
};

const rootReducer = (state, action) => {
  if (typeof state === 'undefined') {
    return DEFAULT_STATE;
  }
  switch (action.type) {
    case ActionConstants.SET_CONFIG:
      return Object.assign({}, state, {config: action.payload});
    case NoriActionConstants.CHANGE_STORE_STATE:
      return Object.assign({}, state, {config: action.payload});
    default:
      return state;
  }
};

// Root reducer
const appStore = createStore(rootReducer);

export default appStore;


