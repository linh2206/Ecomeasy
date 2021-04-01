import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    SetBankList: "[SetBankList] Action",
    SetBalanceList: "[SetBalanceList] Action",
};
export const initialCommonState = {
    bankList: false,
    balanceList: false
};

export const reducer = persistReducer(
    { storage, key: "process", whitelist: ["bankList"] },
    (state = initialCommonState, action) => {
        switch (action.type) {
            case actionTypes.SetBankList: {
                return { ...state, bankList: action.payload }
            }
            case actionTypes.SetBalanceList: {
                return { ...state, balanceList: action.payload }
            }
            default:
                return state;
        }
    }
);

export const actions = {
    setBankList: data => ({
        type: actionTypes.SetBankList,
        payload: { data }
    }),
    setBalanceList: data => ({
        type: actionTypes.SetBalanceList,
        payload: { data }
    }),
};