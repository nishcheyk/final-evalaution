import React from "react";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token"); // if you store token locally
    navigate("/login", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "none",
        border: "none",
        color: "white",
        cursor: "pointer",
        padding: "0",
        marginTop: "1rem",
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
