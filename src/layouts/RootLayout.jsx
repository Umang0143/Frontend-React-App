import { Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

function RootLayout() {
  return (
    <Row className="g-0">
      {/* Sidebar */}
      <Col
        lg={2}
        md={3}
        className="bg-dark text-white shadow"
        style={{ minHeight: "100vh" }}
      >
        <Sidebar />
      </Col>

      {/* Right Content */}
      <Col lg={10} md={9}>
        <TopNavbar />

        <div className="p-4 bg-light min-vh-100">
          <Outlet />
        </div>
      </Col>
    </Row>
  );
}

export default RootLayout;
