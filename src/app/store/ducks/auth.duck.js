import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken } from "../../crud/auth.crud";
import * as routerHelpers from "../../router/RouterHelpers";
import { reducer as brandReducer } from "./brand.duck"

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
  SetPage: "[SetPage] Action",
  SetFirstLoad: "[SetFirstLoad] Action",
  SetRoles: "[SetRoles] Action",
  SetPermissions: "[SetPermissions] Action",
  UpdateUser: "[UpdateUser] Action"
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,
  defaultPage: '',
  isFirstLoad: false,
  roles: false,
  permissions: false
};



export const reducer = persistReducer(
  { storage, key: "demo1-auth", whitelist: ["user", "authToken", "defaultPage", "isFirstLoad", "roles", "permissions"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { token } = action.payload;
        return { ...state, authToken: token, isFirstLoad: true };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;
        return { ...state, authToken };
      }

      case actionTypes.Logout: {
        routerHelpers.forgotLastLocation();
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;

        return { ...state, user };
      }

      case actionTypes.SetPage: {
        const defaultPage = action.payload;

        return { ...state, defaultPage: defaultPage };
      }

      case actionTypes.SetFirstLoad: {

        return { ...state, isFirstLoad: action.payload };
      }

      case actionTypes.SetRoles: {

        return { ...state, roles: action.payload };
      }

      case actionTypes.SetPermissions: {

        return { ...state, permissions: action.payload };
      }

      case actionTypes.UpdateUser: {

        return { ...state, user: action.payload };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: payload => ({ type: actionTypes.Login, payload: payload }),
  register: authToken => ({
    type: actionTypes.Register,
    payload: { authToken }
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: user => ({ type: actionTypes.UserRequested, payload: { user } }),
  fulfillUser: user => ({ type: actionTypes.UserLoaded, payload: { user } }),
  setPage: defaultPage => ({ type: actionTypes.SetPage, payload: { defaultPage } }),
  setFirstLoad: flag => ({ type: actionTypes.SetFirstLoad, payload: { flag } }),
  setRoles: roles => ({ type: actionTypes.SetRoles, payload: { roles } }),
  SetPermissions: permissions => ({ type: actionTypes.SetPermissions, payload: { permissions } }),
  updateUser: user => ({ type: actionTypes.UpdateUser, payload: { user } }),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    //yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const { data: user } = yield getUserByToken();

    yield put(actions.fulfillUser(user));
  });
}
