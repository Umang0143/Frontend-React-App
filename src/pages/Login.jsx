import { useState, useEffect } from "react";
import { Form, Button, InputGroup, Container } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { signIn, fetchAuthSession, signOut } from "aws-amplify/auth";
import { toast } from "react-toastify";
import "../assets/css/signup.css";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Handle Input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Auto Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !isTokenExpired(token)) {
      navigate("/dashboard");
    } else {
      localStorage.clear(); // expired token remove
    }
  }, []);

  // Login Function (Correct Flow)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signOut();
      // Cognito Login
      const res = await signIn({
        username: form.email.toLowerCase(),
        password: form.password,
      });

      // Check if user is confirmed
      if (!res.isSignedIn) {
        if (res.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
          toast.warning("Please verify your email first");
          navigate("/verify", { state: { email: form.email } });
          return;
        }
      }

      // Get Tokens
      const session = await fetchAuthSession();
      const idToken = session.tokens.idToken.toString();
      const accessToken = session.tokens.accessToken?.toString();

      // Store Tokens
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("token", idToken);

      toast.success("Login Successful");

      // Redirect to Dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);

      // Cognito Errors
      if (err.name === "UserNotFoundException") {
        toast.error("User not found. Please signup");
        setTimeout(() => navigate("/signup"), 1500);
      } else if (err.name === "UserNotConfirmedException") {
        toast.warning("Please verify your email first");
        navigate("/verify", { state: { email: form.email } });
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
            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Button */}
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
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Login;
