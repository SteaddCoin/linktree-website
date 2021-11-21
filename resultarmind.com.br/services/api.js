import axios from "axios";

const api = axios.create({ baseURL: "http://resultarmind.com.br:8000/" });

export default api;
