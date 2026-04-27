import { useState, useEffect } from "react";
import { Form, Button, InputGroup, Container } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { signIn, fetchAuthSession } from "aws-amplify/auth";
import { toast } from "react-toastify";
import "../../assets/scss/signup.scss";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const location = useLocation();

  const redirectTo = location.state?.from || "/dashboard";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* Token Expiry Check */
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  /* Auto Login Check */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !isTokenExpired(token)) {
      navigate("/dashboard");
    } else {
      localStorage.clear();
    }
  }, []);

  /* Login */
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await signIn({
        username: form.email.toLowerCase(),
        password: form.password,
      });

      if (!res.isSignedIn) {
        if (res.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
          toast.warning("Please verify your email first");

          navigate("/verify", {
            state: {
              email: form.email,
            },
          });

          return;
        }
      }

      /* Fetch Tokens */
      const session = await fetchAuthSession();

      const idToken = session.tokens?.idToken?.toString();

      const accessToken = session.tokens?.accessToken?.toString();

      if (!idToken) {
        throw new Error("Token not found");
      }

      /* Store Tokens */
      localStorage.setItem("token", idToken);

      localStorage.setItem("idToken", idToken);

      localStorage.setItem("accessToken", accessToken);

      /* User Claims */
      const claims = session.tokens.idToken.payload;

      localStorage.setItem("user_email", claims.email || "");

      localStorage.setItem("user_sub", claims.sub || "");

      toast.success("Login Successful");

      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("Login Error:", err);

      if (err.name === "UserNotFoundException") {
        toast.error("User not found. Please signup");

        setTimeout(() => {
          navigate("/signup");
        }, 1500);
      } else if (err.name === "UserNotConfirmedException") {
        toast.warning("Please verify email first");

        navigate("/verify", {
          state: {
            email: form.email,
          },
        });
      } else if (err.name === "NotAuthorizedException") {
        toast.error("Invalid email or password");
      } else {
        toast.error(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="bg-blur"></div>
      <div className="overlay"></div>

      <Container className="d-flex justify-content-center align-items-center h-100">
        <div className="signup-card p-4">
          <h2 className="text-center fw-bold mb-2">Welcome Back</h2>

          <p className="text-center text-muted mb-4">Login to continue</p>

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email Address"
                autoComplete="username"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 signup-btn py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-center mt-3 small">
              Don't have an account?
              <Link to="/signup">Sign Up</Link>
            </p>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Login;
