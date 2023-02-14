import axios from "axios";

//const url = "https://fyeo-chatbot.herokuapp.com";

// const url = "https://fyeo-chatbot.onrender.com";

const url = "https://ask-fyeo-chatbot-68o6.onrender.com";

// const url = "http://localhost:80";

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
