import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7205/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  console.log("REQUEST:");
  console.log(config.url);
  console.log(config.data);

  return config;
});

export default api;