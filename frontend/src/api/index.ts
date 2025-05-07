import axios from "axios";


let $api = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 5000,
    headers: {}
})
$api.defaults.withCredentials = true;


export default $api;