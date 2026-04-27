import { useState } from "react";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "../../assets/scss/signup.scss";


function VerifyOtp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Email and OTP required");
      return;
    }

    try {
      setLoading(true);

      const res = await confirmSignUp({
        username: email,
        confirmationCode: otp,
      });

      console.log(res);

      toast.success("Account verified successfully");

      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.warning("Enter email first");
      return;
    }

    try {
      await resendSignUpCode({
        username: email,
      });

      toast.info("OTP sent again");
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="signup-page">
      <div className="bg-blur"></div>
      <div className="overlay"></div>

      <Container className="d-flex justify-content-center align-items-center h-100">
        <div className="signup-card p-4">

          <h2 className="text-center fw-bold mb-2">
            Verify Your Account
          </h2>

          <p className="text-center text-muted mb-4">
            Enter OTP sent to your email
          </p>

          <Form onSubmit={handleVerify}>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 signup-btn py-2 mb-2"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Account"}
            </Button>

            <Button
              type="button"
              variant="outline-secondary"
              className="w-100"
              onClick={handleResend}
            >
              Resend OTP
            </Button>

            <p className="text-center mt-3">
              Back to <a href="/login">Login</a>
            </p>

          </Form>
        </div>
      </Container>
    </div>
  );
}

export default VerifyOtp;