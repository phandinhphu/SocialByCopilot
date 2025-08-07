import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com";

const APIRequest = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Xử lý lỗi toàn cục
APIRequest.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export const get = async (url, params = {}) => {
    const response = await APIRequest.get(url, { params });
    return response.data;
};

export const post = async (url, data = {}) => {
    const response = await APIRequest.post(url, data);
    return response.data;
};

export const put = async (url, data = {}) => {
    const response = await APIRequest.put(url, data);
    return response.data;
};

export const del = async (url) => {
    const response = await APIRequest.delete(url);
    return response.data;
};

export default APIRequest;
