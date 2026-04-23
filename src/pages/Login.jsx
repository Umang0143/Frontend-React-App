import { useState } from "react";
import { Form, Button, InputGroup, Container } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { signIn, fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import { toast } from "react-toastify";
import "../assets/css/signup.css";

import { loginUser } from "../auth/authService";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1️⃣ Cognito Signin
            await signIn({
                username: form.email,
                password: form.password,
            });

            // 2️⃣ Token
            const session = await fetchAuthSession();
            const idToken = session.tokens.idToken.toString();

            localStorage.setItem("token", idToken);

            // 3️⃣ Backend verify
            const res = await axios.get(
                "http://127.0.0.1:8000/users",
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            if (res.status === 200) {
                toast.success("Login Successful 🚀");
                navigate("/dashboard");
            }

        } catch (err) {
            console.log(err);

            // 🔥 MOST IMPORTANT PART

            if (err.name === "UserNotFoundException") {
                // ❌ User exist nahi karta
                toast.error("User not found ❌ Please signup first");

                setTimeout(() => {
                    navigate("/signup");
                }, 1500);

            } else if (err.name === "UserNotConfirmedException") {
                toast.warning("Please verify your email first 📩");
                navigate("/verify", {
                    state: { email: form.email },
                });

            } else if (err.name === "NotAuthorizedException") {
                // ❌ Wrong password
                toast.error("Invalid email or password");

            } else {
                toast.error(err.message || "Login Failed");
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
                    <p className="text-center text-muted mb-4">
                        Login to continue
                    </p>

                    <Form onSubmit={handleLogin}>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email Address"
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
                                    onChange={handleChange}
                                    required
                                />

                                <Button
                                    variant="outline-secondary"
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
                            {loading ? "Logging in..." : "Login"}
                        </Button>

                        <p className="text-center mt-3">
                            Don't have an account?{" "}
                            <Link to="/signup">Sign Up</Link>
                        </p>

                    </Form>
                </div>
            </Container>
        </div>
    );
}

export default Login;