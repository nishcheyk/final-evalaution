import React, { useState, useEffect } from "react";
import { useRegisterUserMutation } from "../services/apiSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import styles from "../style/Login.module.css"; // Reusing Login styles

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = formData;

  const [registerUser, { isLoading, error, isSuccess }] =
    useRegisterUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      alert("Registration successful! Please login.");
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await registerUser({ name, email, password }).unwrap();
    } catch {
      // error handled by RTK Query error state
    }
  };

  return (
    <div className={styles.background}>
      <motion.form
        onSubmit={onSubmit}
        className={styles.container}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className={styles.title}>Register</h2>
        <input
          name="name"
          placeholder="Name"
          value={name}
          onChange={onChange}
          required
          className={styles.input}
          maxLength={64}
          autoComplete="name"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
          className={styles.input}
          maxLength={64}
          autoComplete="email"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
          className={styles.input}
          maxLength={64}
          autoComplete="new-password"
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={onChange}
          required
          className={styles.input}
          maxLength={64}
          autoComplete="new-password"
        />
        <motion.button
          type="submit"
          disabled={isLoading}
          className={styles.button}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isLoading ? "Registering..." : "Register"}
        </motion.button>
        {error && (
          <motion.p
            className={styles.errorMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {(error as any).data?.message || "Registration failed"}
          </motion.p>
        )}
        <Link to="/login" className={styles.registerLink}>
          Already have an account? Login here
        </Link>
      </motion.form>
    </div>
  );
};

export default Register;
