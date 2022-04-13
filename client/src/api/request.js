import axios from 'axios';
import {message} from 'ant-design-vue';

const instance = axios.create({baseURL: process.env.VUE_APP_BASE_URL});

instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    if (!response.data.success) {
        message.error(response.data.msg).then();
        return Promise.reject(new Error(response.data.msg));
    }

    return Promise.resolve(response.data.data);
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.error(error);
    return Promise.reject(error);
});

export default instance;