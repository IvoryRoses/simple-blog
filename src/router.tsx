import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import Blogs from "./pages/BlogList";
import BlogCreate from "./pages/BlogCreate";
import BlogEdit from "./pages/BlogEdit";
import BlogView from "./pages/BlogView";
import ProtectedRoute from "./components/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/new" element={<BlogCreate />} />
        <Route path="/blogs/:id/edit" element={<BlogEdit />} />
        <Route path="/blogs/:id/view" element={<BlogView />} />
      </Routes>
    </BrowserRouter>
  );
}
