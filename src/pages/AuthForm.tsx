import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/authSlice";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authorName, setAuthorName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) setError(error.message);
        else if (data.user) {
          dispatch(
            setUser({
              id: data.user.id,
              email: data.user.email!,
              user_metadata: data.user.user_metadata,
            }),
          );
          navigate("/blogs");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              author_name: authorName,
            },
          },
        });
        if (error) setError(error.message);
        else console.log("Registration successful");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f7f9] p-4">
      <form
        onSubmit={handleSubmit}
        className="hover:shadow-3xl w-full max-w-md rounded-xl bg-white p-10 shadow-2xl transition-all"
      >
        <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-800">
          {isLogin ? "Welcome Back!" : "Create Account"}
        </h2>

        {error && (
          <p className="mb-6 rounded bg-red-100 p-3 text-center text-red-700">
            {error}
          </p>
        )}

        {!isLogin && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Author Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow-sm transition outline-none focus:border-blue-500 focus:ring focus:ring-purple-200"
              placeholder="Your Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow-sm transition outline-none focus:border-blue-500 focus:ring focus:ring-purple-200"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow-sm transition outline-none focus:border-blue-500 focus:ring focus:ring-purple-200"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {!isLogin && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow-sm transition outline-none focus:border-blue-500 focus:ring focus:ring-purple-200"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full transform rounded-lg py-3 text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg ${
            isLogin
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? isLogin
              ? "Logging in..."
              : "Registering..."
            : isLogin
              ? "Login"
              : "Register"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-blue-600 hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
