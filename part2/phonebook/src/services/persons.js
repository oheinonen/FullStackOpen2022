import axios from 'axios'
const baseUrl = '/api/persons'

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
  };
  
const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  };

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`) 
  };

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
  };
  
    
export default {create, getAll, deletePerson, update}  
