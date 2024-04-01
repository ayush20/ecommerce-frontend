import axios from 'axios';
import constant from './constant'; 
const client = axios.create({
  baseURL: constant.API_URL,
});


client.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => {
    window.location.href = '/error_404';
    return Promise.reject(error);
  }
);

function getauthtoken(){
  let token = localStorage.getItem('USER_TOKEN');
  let Authtoken = '';
  if(token !=null && token !='' && token !=undefined){
      Authtoken = token;
  }
  const config = {
    headers: { 'X-Authorization': `Bearer ${Authtoken}` }
  };
  return config;
}
export class ApiService {
  static async fetchData(url) {
    try {
      const response = await client.get(url, getauthtoken());
      return response.data;
    } catch (error) {
      // console.error('Error fetching data:', error);
      throw error;
    }
  }

  static async postData(url,data) {
    try {
      const response = await client.post(url, data, getauthtoken());
      return response.data;
    } catch (error) {
      // console.error('Error posting data:', error);
      throw error;
    }
  }

  static async numberFormat(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
