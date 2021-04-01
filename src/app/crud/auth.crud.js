import axios from '../helpers/axios'

export const LOGIN_URL = "/api/v1/login";
export const REGISTER_URL = "api/v1/register";
export const REQUEST_PASSWORD_URL = "/api/v1/password-of-email";
export const SET_PASSWORD_URL = token => `/api/v1/new-password?token=${token}`
export const ROLE_LIST = `/api/v1/roles-permissions`
export const INVITE_USER = (brandId) => `/api/brand/${brandId}/invite-manage-brand`
export const VIEW_INVITATION = (token) => `/api/v1/invite-manage-brand?token=${token}`
export const ACCEPT_INVITATION = (brand, token) => `/api/brand/${brand}/reject-accept-manage-brand?token=${token}`
export const CHANGE_PASSWORD = '/api/v1/change-password'
export const UPDATE_USER = '/api/v1/user/update'
export const GET_LOG = '/api/logs'
export const CREATE_ROLE = '/api/v1/admin/add-user-permission'
export const ADD_ADMIN = brandId => `/api/v1/brand/${brandId}/add-admin-brand`
export const GET_USER = '/api/v1/user/profile'
export const REMOVE_ADMIN = brandId => `/api/v1/brand/${brandId}/remove-admin-brand`

export const ME_URL = "api/me";

export function login(email, password) {
  let data = new FormData()
  data.append('email', email)
  data.append('password', password)
  return axios({
    method: 'post',
    url: LOGIN_URL,
    data: data
  })
}

export function register(email, password, role) {
  let data = new FormData()
  data.append('email', email)
  data.append('password', password)
  data.append('role', role)
  return axios({
    method: 'post',
    url: REGISTER_URL,
    data: data
  })
}

export function requestPassword(email) {
  let data = new FormData()
  data.append('email', email)
  return axios({
    method: 'post',
    url: REQUEST_PASSWORD_URL,
    data: data
  })
}

export function setPassword(password, token) {
  let data = new FormData()
  data.append('password', password)
  return axios({
    method: 'post',
    url: SET_PASSWORD_URL(token),
    data: data
  })
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}

export const getRoleList = () => axios.get(ROLE_LIST);

export function inviteUser(brandId, email, role) {
  let data = new FormData()
  data.append('email', email)
  data.append('role', role)
  return axios({
    method: 'post',
    url: INVITE_USER(brandId),
    data: data
  })
}

export const viewInvitation = (token) => axios.get(VIEW_INVITATION(token))

export function acceptInvitation(brand, token, action) {
  let data = new FormData()
  data.append('action', action)
  return axios({
    method: 'post',
    url: ACCEPT_INVITATION(brand, token),
    data: data
  })
}

export function changePassword(oldPas, newPas) {
  let data = new FormData()
  data.append('password', oldPas)
  data.append('newPassword', newPas)
  return axios({
    method: 'post',
    url: CHANGE_PASSWORD,
    data: data
  })
}

export function editUser(avatar) {
  let data = new FormData()
  data.append('avatar', avatar)
  return axios({
    method: 'post',
    url: UPDATE_USER,
    data: data
  })
}

export function getLog() {
  return axios({
    method: 'get',
    url: GET_LOG
  })
}

export function createRole(role, email, permissions) {
  let data = new FormData()
  data.append('roleName', role)
  data.append('email', email)
  data.append('permissions', JSON.stringify(permissions))
  return axios({
    method: 'post',
    url: CREATE_ROLE,
    data: data
  })
}

export function addAdmin(brand, email, role) {
  let data = new FormData()
  data.append('email', email)
  data.append('role', role)
  return axios({
    method: 'post',
    url: ADD_ADMIN(brand),
    data: data
  })
}

export function getUser() {
  return axios({
    method: 'get',
    url: GET_USER
  })
}

export function removeAdmin(brandId, email) {
  let data = new FormData()
  data.append('email', email)
  return axios({
    method: 'post',
    url: REMOVE_ADMIN(brandId),
    data: data
  })
}
