import React, { useContext } from "react";
import UserContext from "../context/userContext";
import { use } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);

  if (!user || !user.name) {
    return <Navigate to="/signin" />;
  }
  return children;
}
