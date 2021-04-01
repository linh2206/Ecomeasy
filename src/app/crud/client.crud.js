import axios from '../helpers/axios'
export const LIST_CLIENT_URL = "api/clients";
export const CREATE_CLIENT_URL = "api/clients/create";

export function listClient(token,currentPage,limit) {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios.get(
    `api/clients?page=${currentPage}&limit=${limit}`,
    config
  )
}

export function clientDetail(token, id) {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios.get(
    'api/clients/' + id,
    config
  )
}

export function clientUsage(token, id, from, to) {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios.get(
    `api/clients/${id}/usage?from=${from}&to=${to}`,
    config
  );
}

export function createClient(authToken , name, company, packageA, email, phone, username, password) {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` }
  };
  return axios.post(
    CREATE_CLIENT_URL,
    { name, company, package:packageA, email, phone, username, password },
    config,
  );
}

export function editClient(token, id, data) {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios.post(
    `api/clients/${id}/update`,
    data,
    config
  );
}


