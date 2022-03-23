import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { setTokenHeader } from "../api/api";
import { Buffer } from "buffer";

const ProtectedRoute = ({ setShowLogin }) => {
  let token = localStorage.getItem("token");
  console.log("this", token);

  const isTokenExpired = (token) =>
    Date.now() >= JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).exp * 1000;

  if (token && isTokenExpired(token)) {
    console.log("is expired");
    token = null;
    setTokenHeader();
    localStorage.removeItem("token");
  } else if (token) {
    setTokenHeader(token);
    return <Outlet />;
  }
  //token is null or invalid
  setShowLogin(true);
  return <Navigate replace to="/" />;
};

export default ProtectedRoute;
