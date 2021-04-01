import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    SetProcessList: "[SetProcessList] Action",
};
export const initialCommonState = {
    processList: false
};

export const reducer = persistReducer(
    { storage, key: "process", whitelist: ["processList"] },
    (state = initialCommonState, action) => {
        switch (action.type) {
            case actionTypes.SetProcessList: {
                return { ...state, processList: action.payload }
            }
            default:
                return state;
        }
    }
);

export const actions = {
    setProcessList: flag => ({
        type: actionTypes.SetProcessList,
        payload: { flag }
    }),
};