const API_URL = "http://127.0.0.1:5000/";

// const API_URL = "/Users/Emico/Desktop/hackathon_t/frontend/src/utils/data/";

const apiFetch = (url, method = "GET", data = {}) => {
  console.log(API_URL + url);
  const options = {
    method: method,
  };
  options.headers = {
    "Content-Type": "application/json",
  };
  // const token = localStorage.clear(); // clear all localStorage data
  // we will store 'token' in localStorage which is a authentication mechanism on server
  const token = localStorage.getItem("token");
  if (token) {
    options.headers["Authorization"] = `token ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  return fetch(url, options)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.status !== 204 ? res.json() : {}; // deal with 204 return empty
    })
    .catch((error) => {
      console.error("Error:", error);
      // 可以選擇拋出一個新錯誤，或者回傳一個預設值
      // return "error";
      throw error; // 或者回傳一個預設值，例如：return {};
    });
};

// ajax get method
const get = (path) => apiFetch(API_URL + path, "GET", null);

// ajax post method
const post = (path, data) => apiFetch(API_URL + path, "POST", data);

// ajax delete method
const remove = (path, data) => apiFetch(API_URL + path, "DELETE", data);

// ajax patch method
const patch = (path, data) => apiFetch(API_URL + path, "PATCH", data);

export default { get, post, remove, patch };
