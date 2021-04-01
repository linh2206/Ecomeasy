import axios from "axios";
import _ from "lodash"

var axiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true,
  /* other custom settings */
});

axiosInstance.interceptors.response.use(response => {
  //Token expired
  if (_.get(response, 'data.err') === 401 || _.get(response, 'data.errMsg') === 'token is required') {
    document.dispatchEvent(new CustomEvent('tokenExpired'))
  }
  else {
    return response
  }
})


export default axiosInstance