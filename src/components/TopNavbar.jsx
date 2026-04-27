import {
  Navbar,
  Container,
  Form,
  FormControl,
  Dropdown,
} from "react-bootstrap";

import { NavLink, useNavigate } from "react-router-dom";

import { signOut } from "aws-amplify/auth";

function TopNavbar() {
  const navigate = useNavigate();

  const isLoggedIn = !!(
    localStorage.getItem("idToken") || localStorage.getItem("token")
  );

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log(error);
    }

    localStorage.clear();

    navigate("/");
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow px-4 py-3">
      <Container fluid>
        <h4 className="mb-0 fw-bold">Dashboard</h4>

        <div className="d-flex align-items-center gap-3">

          <Dropdown>
            <Dropdown.Toggle variant="primary">Profile</Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to="/profile">
                My Profile
              </Dropdown.Item>

              {!isLoggedIn && (
                <>
                  <Dropdown.Item as={NavLink} to="/login">
                    Login
                  </Dropdown.Item>

                  <Dropdown.Item as={NavLink} to="/signup">
                    Sign Up
                  </Dropdown.Item>
                </>
              )}

              <Dropdown.Divider />

              <Dropdown.Item
                className="text-danger"
                disabled={!isLoggedIn}
                onClick={isLoggedIn ? handleLogout : undefined}
              >
                {isLoggedIn ? "Logout" : "Logout (Disabled)"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
