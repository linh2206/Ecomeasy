import axios from '../helpers/axios'

export const CREATE_BANK = '/api/create-bank'
export const BANK_LIST = '/api/bank'
export const CREATE_BANK_ACCOUNT = bankId => `/api/bank/${bankId}/add-account`
export const ADD_BALANCE = bankId => `/api/bank/${bankId}/add-balance`
export const GET_BALANCE = (from, to) => `/api/balance?from=${from}&to=${to}`
export const DELETE_ACCOUNT = bankId => `/api/bank/${bankId}/delete-account`
export const EDIT_BALANCE = balanceId => `/api/balance/${balanceId}/edit-balance`
export const GET_BALANCE_DETAIL = (accountNumber) => `/api/balance/${accountNumber}`
export const DELETE_BANK = bankId => `/api/bank/${bankId}/delete-bank`
export const DELETE_BALANCE = balanceId => `/api/balance/${balanceId}/remove-balance`
export const FINANCE_REPORT = '/api/finance-report'

export function sendReport(emails) {
    const data = new FormData()
    data.append('emails', JSON.stringify(emails))
    return axios({
        method: 'POST',
        url: FINANCE_REPORT,
        data: data
    })
}

export function deleteBalance(balanceId) {
    return axios({
        method: 'POST',
        url: DELETE_BALANCE(balanceId)
    })
}

export function deletebank(bankId) {
    return axios({
        method: 'POST',
        url: DELETE_BANK(bankId)
    })
}

export const getBalanceDetail = (accountNumber) => axios({
    method: 'GET',
    url: GET_BALANCE_DETAIL(accountNumber)
})

export const editBalance = (balanceId, balance) => {
    const data = new FormData()
    data.append('balance', balance)
    return axios({
        method: 'POST',
        url: EDIT_BALANCE(balanceId),
        data: data
    })
}

export const deleteAccount = (bankId, accountNumber, accountName) => {
    const data = new FormData()
    data.append('accountNumber', accountNumber)
    data.append('accountName', accountName)
    return axios({
        method: 'POST',
        url: DELETE_ACCOUNT(bankId),
        data: data
    })
}

export const createBank = name => {
    const data = new FormData()
    data.append('name', name)
    return axios({
        method: 'POST',
        url: CREATE_BANK,
        data: data
    })
}

export const getListBank = () => axios({
    method: 'GET',
    url: BANK_LIST
})

export const getBalance = (from, to) => axios({
    method: 'GET',
    url: GET_BALANCE(from, to)
})

export const createBankAccount = (bankId, accountName, accountNumber) => {
    let data = new FormData()
    data.append('accountName', accountName)
    data.append('accountNumber', accountNumber)
    return axios({
        method: 'POST',
        url: CREATE_BANK_ACCOUNT(bankId),
        data: data
    })
}

export const addBalance = (bankName, bankId, accountName, accountNumber, balance, date) => {
    let data = new FormData()
    data.append('bankName', bankName)
    data.append('accountName', accountName)
    data.append('accountNumber', accountNumber)
    data.append('balance', balance)
    data.append('date', date)
    return axios({
        method: 'POST',
        url: ADD_BALANCE(bankId),
        data: data
    })
}