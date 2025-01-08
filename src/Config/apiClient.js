import axios from "axios";

const apiClient = axios.create({
    baseURL: 'https://sysne-production.up.railway.app/',
    headers: {
        'Content-Type':'application/json',
    },
})

export default apiClient;