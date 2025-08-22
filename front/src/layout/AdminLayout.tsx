import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    <nav
      style={{
        width: 220,
        backgroundColor: "#222",
        color: "white",
        padding: "20px",
      }}
    >
      <h3>Admin</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <NavLink
            to="create-plan"
            style={({ isActive }) => ({
              color: isActive ? "#0f62fe" : "white",
            })}
          >
            Create Plan
          </NavLink>
        </li>
        <li>
          <NavLink
            to="manage-plans"
            style={({ isActive }) => ({
              color: isActive ? "#0f62fe" : "white",
            })}
          >
            Manage Plans
          </NavLink>
        </li>
      </ul>
    </nav>
    <main style={{ flex: 1, padding: "20px" }}>
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
