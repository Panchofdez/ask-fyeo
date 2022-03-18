import axios from "axios";

const url = "http://127.0.0.1:5000";

// const url = "localhost:5000/";

export const api = axios.create({
  baseURL: url,
});

export const setTokenHeader = (token) => {
  if (token) {
    console.log("setting token");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // api.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    // api.defaults.headers.common["Content-Type"] = "application/json";
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
  console.log("COMMON HEADERS: ", api.defaults.headers.common);
};
