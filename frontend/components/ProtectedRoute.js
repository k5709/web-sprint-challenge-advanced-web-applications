import React from "react";
import { Route, Navigate } from "react-router-dom";

function ProtectedRoute(props) {
  const { children } = props;
  return localStorage.getItem("token") ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
