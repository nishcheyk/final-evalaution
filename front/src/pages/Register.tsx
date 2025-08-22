import React, { useState, useEffect } from "react";
import { useRegisterUserMutation } from "../services/apiSlice";
import { useNavigate } from "react-router-dom";

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
    <form onSubmit={onSubmit}>
      <h2>Register</h2>
      <input
        name="name"
        placeholder="Name"
        value={name}
        onChange={onChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={onChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={onChange}
        required
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={onChange}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </button>
      {error && (
        <p style={{ color: "red" }}>
          {(error as any).data?.message || "Registration failed"}
        </p>
      )}
    </form>
  );
};

export default Register;
