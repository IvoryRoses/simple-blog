import { useState } from "react";
import { supabase } from "../supabase";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

export default function BlogCreate() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let imageUrl: string | null = null;

    if (image && user) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("blog-image")
        .upload(fileName, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("blog-image")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("blogs").insert({
      title,
      content,
      image_url: imageUrl,
      author_id: user?.id,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/blogs");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-purple-400 via-pink-400 to-red-400 p-8">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Create Blog</h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-2 text-red-700">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Blog title"
            className="mb-4 w-full rounded border p-3 focus:border-purple-500 focus:ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            className="mb-4 w-full"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />

          <textarea
            placeholder="Write something..."
            className="mb-4 w-full rounded border p-3 focus:border-purple-500 focus:ring"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
            >
              {loading ? "Posting..." : "Create"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/blogs")}
              className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
