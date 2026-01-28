import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../slices/authSlice";
import { supabase } from "../supabase";
import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";

export default function Blogs() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
    navigate("/");
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">
        Welcome, {user?.email || "Guest"}
      </h1>
      <button
        onClick={handleLogout}
        className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
      >
        Logout
      </button>

      {/* Your blog list / create form will go here */}
    </div>
  );
}
