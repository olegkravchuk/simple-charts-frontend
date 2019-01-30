import axios from 'axios';

export const client = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_VERSION}`,
});

client.interceptors.response.use(response => (
    response.data
), error => (
    new Promise((resolve, reject) => {
        if (error.response.status === 400 || error.response.status === 401) {
            reject(error.response.data);
        } else {
            reject(error);
        }
    })
));