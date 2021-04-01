import axios from '../helpers/axios'
export const DASHBOARD_URL = "api/dashboard/clients-usage/last-30days";
// http://localhost:3001/api/dashboard/clients-usage/last-30days

export function getDashboard(token) {
    console.log(token)
    const config = {
      headers: { 
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    return axios.get(
        DASHBOARD_URL,
      config
    )
  }
