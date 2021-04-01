import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    ShowBackdropLoading: "[ShowBackdropLoading] Action",
};
export const initialCommonState = {
    isShowBackdropLoading: false
};

export const reducer = persistReducer(
    { storage, key: "common", whitelist: ["isShowBackdropLoading"] },
    (state = initialCommonState, action) => {
        switch (action.type) {
            case actionTypes.ShowBackdropLoading: {
                return { ...state, isShowBackdropLoading: action.payload }
            }
            default:
                return state;
        }
    }
);

export const actions = {
    showBackdropLoading: flag => ({
        type: actionTypes.ShowBackdropLoading,
        payload: { flag }
    }),
};