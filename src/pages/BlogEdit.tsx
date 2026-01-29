import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function BlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("title, content")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setTitle(data.title);
        setContent(data.content);
      }

      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("blogs")
      .update({ title, content })
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      navigate("/blogs");
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-400 to-purple-400 p-8">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold">Edit Blog</h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-2 text-red-700">{error}</p>
        )}

        <form onSubmit={handleUpdate}>
          <input
            className="mb-4 w-full rounded border p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="mb-4 w-full rounded border p-3"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex gap-2">
            <button className="rounded bg-blue-500 px-4 py-2 text-white">
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate("/blogs")}
              className="rounded bg-gray-300 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
