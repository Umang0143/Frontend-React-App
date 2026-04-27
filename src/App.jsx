import { RouterProvider } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/scss/sidebar.scss";
function App() {
  return (
    <>
      <RouterProvider router={AppRoutes} />
      <ToastContainer />
    </>
  );
}

export default App;
