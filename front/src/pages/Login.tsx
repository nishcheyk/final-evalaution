import React, { useState, useEffect } from "react";
import { useLoginUserMutation } from "../services/apiSlice";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import styles from "../style/Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { data, isLoading, error }] = useLoginUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      dispatch(setCredentials({ ...data.user, token: data.token }));

      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, token: data.token })
      );
      console.log(localStorage.getItem("user"));
      if (data.user.role === "admin") navigate("/admin/create-plan");
      else navigate("/user/dashboard");
    }
  }, [data, dispatch, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ email, password });
  };

  return (
    <div className={styles.background}>
      <motion.form
        onSubmit={handleSubmit}
        className={styles.container}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className={styles.title}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
          maxLength={64}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
          maxLength={64}
          autoComplete="current-password"
        />
        <motion.button
          type="submit"
          disabled={isLoading}
          className={styles.button}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </motion.button>
        {error && (
          <motion.p
            className={styles.errorMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Login failed
          </motion.p>
        )}
        <Link to="/register" className={styles.registerLink}>
          Don't have an account? Register here
        </Link>
      </motion.form>
    </div>
  );
};

export default Login;
