import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import type { Blog } from "./BlogList";

export default function BlogView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setBlog(data);
      }
      setLoading(false);
    };

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };

    fetchBlog();
    getUser();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this blog?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (!error) {
      navigate("/blogs");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-lg">
        <button
          onClick={() => navigate("/blogs")}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Back to Blogs
        </button>

        {blog.image_url && (
          <img
            src={blog.image_url}
            alt={blog.title}
            className="mb-6 h-96 w-full rounded-xl object-cover"
          />
        )}

        <h1 className="mb-2 text-4xl font-bold text-gray-800">{blog.title}</h1>

        <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
          <p>By {blog.author_name || "Anonymous"}</p>
          <p>•</p>
          <p>{new Date(blog.created_at).toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="whitespace-pre-wrap text-gray-700">{blog.content}</p>
        </div>

        {blog.author_id === userId && (
          <div className="mt-8 flex gap-2 border-t pt-6">
            <button
              onClick={() => navigate(`/blogs/${blog.id}/edit`)}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
