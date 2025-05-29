import axios from "axios";


let $api = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 5000,
    headers: {}

})
$api.defaults.withCredentials = true;

$api.interceptors.request.use(config => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (token && ['get', 'post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase())) {
        config.headers['X-XSRF-TOKEN'] = token;
    }
    return config;
});

$api.interceptors.response.use((config) => {
    return config
}, async (er) => {
    const originalRequest = er.config;
    if (er.response.status === 401 && er.config && !er.config._isRetry) {
        originalRequest._isRetry = true
        try {

            return $api.request(originalRequest)
        } catch (e) {
            console.log('not logged in')
        }
    }
    throw er
})

function getCsrfToken() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
}


export default $api;