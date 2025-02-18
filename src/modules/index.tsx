import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const apiKey = process.env.API_KEY;
const instance = axios.create({ baseURL });
instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${apiKey}`;
  return config;
});

export { instance, baseURL };
