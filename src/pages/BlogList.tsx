import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../slices/authSlice";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";

interface Blog {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function BlogsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
    navigate("/");
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this blog?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (!error) {
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-purple-400 via-pink-400 to-red-400 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Blogs</h1>

          <div className="flex gap-2">
            <Link
              to="/blogs/new"
              className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
            >
              New Blog
            </Link>

            <button
              onClick={handleLogout}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        {blogs.length === 0 ? (
          <p className="text-gray-500">No blogs yet.</p>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="rounded-xl border bg-white p-6 shadow-md"
              >
                <h2 className="text-xl font-bold">{blog.title}</h2>
                <p className="mt-2 text-gray-700">{blog.content}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/blogs/${blog.id}/edit`)}
                    className="rounded bg-blue-500 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="rounded bg-red-500 px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
