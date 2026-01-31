import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../slices/authSlice";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";

export interface Blog {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  image_url?: string;
}

export default function BlogsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 5;

  const fetchBlogs = async (pageNumber = page) => {
    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, count, error } = await supabase
      .from("blogs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error && data) {
      setBlogs(data);
      setTotal(count ?? 0);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });

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
                {blog.image_url && (
                  <img
                    src={blog.image_url}
                    className="mb-4 h-96 w-full rounded object-cover"
                  />
                )}
                <p className="mt-2 text-gray-700">{blog.content}</p>

                <div className="mt-4 flex gap-2">
                  {blog.author_id === userId && (
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
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 flex items-center justify-between">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {Math.ceil(total / PAGE_SIZE)}
          </span>

          <button
            disabled={page * PAGE_SIZE >= total}
            onClick={() => setPage((p) => p + 1)}
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
