import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { takeLatest } from "redux-saga/effects";

export const actionTypes = {
  ListClient : "[ListClient] Action",
  CreateClient : "[CreateClient] Action",
  EditClient : "[EditClient] Action",
};

const initialAuthState = {
  user: undefined,
  authToken: undefined
};

export const reducer = persistReducer(
    { storage, key: "demo1-auth", whitelist: ["user", "authToken"] },
    (state = initialAuthState, action) => {
      switch (action.type) {
        case actionTypes.ListClient: {
          const { token } = action.payload;

          return { authToken: token };
        }

        case actionTypes.CreateClient: {
          const { token } = action.payload;

          return { authToken: token };
        }
        case actionTypes.EditClient: {
          const { token } = action.payload;

          return { authToken: token };
        }

        default:
          return state;
      }
    }
);

export const actions = {
  create: authToken => ({
    type: actionTypes.CreateClient,
    payload: { authToken }
  }),
  list: payload =>  authToken => ({
    type: actionTypes.ListClient,
    payload: { authToken }
  }),
  list: payload =>  authToken => ({
    type: actionTypes.EditClient,
    payload: { authToken }
  }),
};

export function* saga() {
  yield takeLatest(actionTypes.CreateClient, function* loginSaga() {
    // yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.ListClient, function* registerSaga() {
    // yield put(actions.requestUser());
  });
  yield takeLatest(actionTypes.EditClient, function* editSaga() {
    // yield put(actions.requestUser());
  });
}
