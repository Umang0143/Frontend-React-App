import { useState } from "react";
import { Form, Button, InputGroup, Container } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "aws-amplify/auth";
import { toast } from "react-toastify";
import API from "../services/api";
import "../assets/css/signup.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    address: "",
    fileUrl: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const uploadImage = async () => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "sumang_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhc9vy4v2/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      return result.secure_url;
    } catch (error) {
      console.log("Image upload error:", error);
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      let imageUrl = "";

      if (file) {
        imageUrl = await uploadImage();
      }

      await signUp({
        username: form.email,
        password: form.password,
        options: {
          userAttributes: {
            email: form.email,
            name: form.name,
            phone_number: "+91" + form.mobile,
          },
        },
      });

      await API.post("/signup", {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        address: form.address,
        fileUrl: imageUrl,
      });

      toast.success("Signup Successful! OTP sent to email ");

      navigate("/verify", {
        state: { email: form.email },
      });

    } catch (err) {
      console.log(err);
      toast.error(err.message || "Signup Failed");
    }
  };

  return (
    <div className="signup-page">
      <div className="bg-blur"></div>
      <div className="overlay"></div>

      <Container className="d-flex justify-content-center align-items-center h-100">
        <div className="signup-card p-4">

          <h2 className="text-center fw-bold mb-2">Create Account</h2>
          <p className="text-center text-muted mb-4">Start your journey</p>

          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Control
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            </Form.Group>

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

            <Form.Group className="mb-3">
              <InputGroup>
                <Form.Control
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                name="mobile"
                placeholder="Mobile Number"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                placeholder="Address"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="img-fluid mb-2"
                style={{ height: "150px", objectFit: "cover" }}
              />
            )}

            <Button type="submit" className="w-100 signup-btn py-2">
              Sign Up
            </Button>

            <p className="text-center mt-3">
              Already have an account? <Link to="/login">Login</Link>
            </p>

          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Signup;