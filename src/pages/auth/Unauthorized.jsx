import { Container, Card, Button } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow p-5 text-center rounded-4">
        <h2 className="mb-3">⚠ Access Denied</h2>

        <p className="text-muted">
          You are not logged in. Please log in to access the dashboard.
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            onClick={() =>
              navigate("/login", {
                state: {
                  from: "/dashboard",
                },
              })
            }
          >
            Login
          </Button>

          <Button variant="secondary" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </div>
      </Card>
    </Container>
  );
}

export default Unauthorized;
