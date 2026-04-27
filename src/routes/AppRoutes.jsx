import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";

import Home from "../pages/Home";
import Users from "../pages/Users";
import Products from "../pages/Products";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Unauthorized from "../pages/auth/Unauthorized";

import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "verify",
        element: <VerifyOtp />,
      },

      {
        path: "users",
        element: <Users />,
      },

      {
        path: "products",
        element: <Products />,
      },

      {
        path: "login",
        element: <Login />,
      },

      {
        path: "signup",
        element: <Signup />,
      },

      {
        path: "unauthorized",
        element: <Unauthorized />,
      },

      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default AppRoutes;
