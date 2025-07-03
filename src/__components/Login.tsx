import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
import type { AppDispatch, RootState } from "../store/index"

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 space-y-4">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default Login;
