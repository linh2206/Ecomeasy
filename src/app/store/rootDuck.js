import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "./ducks/auth.duck";
import * as brand from "./ducks/brand.duck";
import * as common from "./ducks/common.duck"
import * as process from "./ducks/process.duck"
import * as finance from "./ducks/finance.duck"
import { metronic } from "../../_metronic";

const appReducer = combineReducers({
  auth: auth.reducer,
  i18n: metronic.i18n.reducer,
  builder: metronic.builder.reducer,
  brand: brand.reducer,
  common: common.reducer,
  process: process.reducer,
  finance: finance.reducer
});

export const rootReducer = (state, action) => {
  if (action.type === auth.actionTypes.Logout) {
    localStorage.clear()
  }
  return appReducer(state, action)
}


export function* rootSaga() {
  yield all([auth.saga()]);
}
