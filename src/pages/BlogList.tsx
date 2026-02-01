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
  author_name?: string;
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
  const PAGE_SIZE = 6;

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

  return (
    <div className="min-h-screen p-8">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="rounded-xl border border-[#e3e9ee] bg-white shadow-md"
            >
              {blog.image_url && (
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="mb-2 h-60 w-full rounded-t-xl object-cover"
                />
              )}
              <div className="p-4">
                <a className="text-[#a2a8ae]">{blog.created_at}</a>
                <h2 className="text-xl font-bold">{blog.title}</h2>

                <p className="mt-2 h-11 overflow-hidden text-gray-700">
                  {blog.content}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    By {blog.author_name || "Anonymous"}
                  </p>
                  <p
                    onClick={() => navigate(`/blogs/${blog.id}/view`)}
                    className="cursor-pointer text-sm text-blue-500 hover:underline"
                  >
                    View More →
                  </p>
                </div>
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
  );
}
