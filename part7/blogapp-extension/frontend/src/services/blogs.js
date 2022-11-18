import axios from 'axios';
import userService from './user';

const baseUrl = '/api/blogs';

const config = () => {
    return {
        headers: {
            Authorization: `bearer ${userService.getToken()}`,
        },
    };
};

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
};

const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject, config());
    return response.data;
};

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then((response) => response.data);
};

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`, config());
};

const addComment = async (id,comment) => {
    const response = await axios.post(`${baseUrl}/${id}/comments`, { comment: comment }, config());
    return response.data;
};

export default { getAll, create, update, remove, addComment };
