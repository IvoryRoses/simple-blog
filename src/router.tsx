import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/AuthForm";
import Blogs from "./pages/Blogs";
import ProtectedRoute from "./components/ProtectedRoute";

export default function router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
