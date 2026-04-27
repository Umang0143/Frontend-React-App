import { Card, Row, Col } from "react-bootstrap";

function Home() {
  return (
    <>
      <h2 className="mb-4">Dashboard Overview</h2>

      <p className="text-muted mb-4">
        Welcome to the Dashboard Overview. This application is built using React
        for the frontend, AWS Cognito for secure authentication, FastAPI for
        backend APIs, and a database for storing and managing data. User
        authentication is handled through AWS Cognito, where users can sign up,
        verify their email using OTP, and securely log in. After a successful
        login, Cognito generates authentication tokens such as ID Token and
        Access Token, which are used for authorization and secure communication
        with backend services. The frontend communicates with FastAPI APIs using
        protected requests by sending the token in request headers. FastAPI
        validates the token, authenticates the user, and then allows access to
        protected endpoints. Through these APIs, user data is fetched from the
        database and displayed dynamically on the dashboard. This dashboard
        provides functionality such as viewing users, managing products,
        searching records, pagination, updating data, deleting data, and
        monitoring business metrics in real time. Data displayed here is
        retrieved from the database through FastAPI endpoints and rendered
        dynamically in the user interface. The complete system demonstrates
        integration between authentication, backend services, API security, and
        database-driven data management, providing a scalable and
        industry-standard full stack architecture.
      </p>
    </>
  );
}

export default Home;
