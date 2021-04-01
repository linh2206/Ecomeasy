import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    ChangeBrand: "[ChangeBrand] Action",
    ChangeShop: "[ChangeShop] Action",
    ChangeSource: "[ChangeSource] Action",
    SetBrandList: "[SetBrandList] Action",
    AddBrand: "[AddBrand] Action",
    EditBrand: "[EditBrand] Action",
    Reset: "[Reset] Action",
    SetFilter: "[SetFilter] Action",
};

export const initialBrandState = {
    selectedBrand: '',
    selectedShop: '',
    selectedSource: '',
    brandList: [],
    filter: {
        from: '',
        to: '',
        mode: ''
    }
};

export const reducer = persistReducer(
    { storage, key: "brand", whitelist: ["selectedBrand", "brandList", "selectedShop", "selectedSource", "filter"] },
    (state = initialBrandState, action) => {
        switch (action.type) {
            case actionTypes.ChangeBrand: {
                const brand = action.payload;
                return { ...state, selectedBrand: brand, selectedShop: '' }
            }
            case actionTypes.ChangeShop: {
                const shop = action.payload;
                return { ...state, selectedShop: shop }
            }
            case actionTypes.ChangeSource: {
                const source = action.payload;
                return { ...state, selectedSource: source }
            }
            case actionTypes.SetBrandList: {
                const brandList = action.payload;
                if (brandList)
                    return { ...state, brandList: brandList }
                return state
            }
            case actionTypes.AddBrand: {
                const brand = action.payload
                if (brand)
                    return {
                        selectedBrand: state.selectedBrand || brand._id,
                        brandList: [...state.brandList, brand]
                    }
                return state
            }
            case actionTypes.EditBrand: {
                const brand = action.payload
                if (brand) {
                    const updatedList = state.brandList.map(item => item._id === brand._id ? brand : item)
                    return {
                        selectedBrand: state.selectedBrand || brand._id,
                        brandList: [...updatedList]
                    }
                }
                return state

            }
            case actionTypes.SetFilter: {
                const filter = action.payload
                return { ...state, filter: filter }

            }
            case actionTypes.Reset: {
                return initialBrandState
            }
            default:
                return state;
        }
    }
);

export const actions = {
    change: brand => ({
        type: actionTypes.ChangeBrand,
        payload: { brand }
    }),
    changeShop: shop => ({
        type: actionTypes.ChangeShop,
        payload: { shop }
    }),
    setBrandList: brandList => ({
        type: actionTypes.SetBrandList,
        payload: { brandList }
    }),
    addBrand: brand => ({
        type: actionTypes.AddBrand,
        payload: { brand }
    }),
    editBrand: brand => ({
        type: actionTypes.EditBrand,
        payload: { brand }
    }),
    reset: () => ({
        type: actionTypes.Reset,
        payload: ''
    }),
    changeSource: source => ({
        type: actionTypes.ChangeSource,
        payload: { source }
    }),
    setFilter: filter => ({
        type: actionTypes.SetFilter,
        payload: { filter }
    })
};