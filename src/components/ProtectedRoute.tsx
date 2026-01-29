import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
