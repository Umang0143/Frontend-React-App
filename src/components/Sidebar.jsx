import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaBoxOpen,
  FaChartBar,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import Accordion from "react-bootstrap/Accordion";

function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3 shadow"
      style={{
        width: "280px",
        minHeight: "100vh",
      }}
    >
      <h4 className="text-center mb-4 border-bottom pb-3">Admin Panel</h4>

      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link rounded ${
                isActive ? "bg-primary text-white" : "text-light"
              }`
            }
          >
            <FaHome className="me-2" />
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `nav-link rounded ${
                isActive ? "bg-primary text-white" : "text-light"
              }`
            }
          >
            <FaUsers className="me-2" />
            Users
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `nav-link rounded ${
                isActive ? "bg-primary text-white" : "text-light"
              }`
            }
          >
            <FaBoxOpen className="me-2" />
            Products
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
