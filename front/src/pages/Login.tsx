import React, { useState, useEffect } from "react";
import { useLoginUserMutation } from "../services/apiSlice";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { data, isLoading, error }] = useLoginUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      // Dispatch combined user and token to auth slice
      dispatch(setCredentials({ ...data.user, token: data.token }));
      if (data.user.role === "admin") navigate("/admin/create-plan");
      else navigate("/user/dashboard");
    }
  }, [data, dispatch, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 400, margin: "auto", padding: 20 }}
    >
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "#0f62fe",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: 4,
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {error && <p style={{ color: "red" }}>Login failed</p>}
    </form>
  );
};

export default Login;
