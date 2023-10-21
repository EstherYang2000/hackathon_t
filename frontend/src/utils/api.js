const API_URL = "http://localhost:3000/";

// default using GET
const apiFetch = (url, method = 'GET', data = {}) => {
  const options = {
    'method' : method,
  };
  options.headers = {
    'Content-Type': 'application/json',
  };
  // const token = localStorage.clear(); // clear all localStorage data
  // we will store 'token' in localStorage which is a authentication mechanism on server
  const token = localStorage.getItem('token');
  if (token){
    options.headers['Authorization'] = `token ${token}`;
  }

  if (data) { 
    options.body = JSON.stringify(data);
  }

  return fetch(url, options)
    .then(
      res => {
        return res.status !== 204 ? res.json() : {} // deal with 204 return empty
      })
};

// ajax get method
const get = path => 
    apiFetch(API_URL + path, 'GET', null);

// ajax post method
const post = (path, data) =>
	apiFetch(API_URL + path, 'POST', data);

// ajax delete method
const remove = (path, data) =>
	apiFetch(API_URL + path, 'DELETE', data);

// ajax patch method
const patch = (path, data) =>
	apiFetch(API_URL + path, 'PATCH', data);

export default {get, post, remove, patch};