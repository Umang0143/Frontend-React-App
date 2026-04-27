import { Container, Row, Col, Card, Button } from "react-bootstrap";

function Users() {

  return (
    <Container fluid>
      <h2 className="fw-bold mb-4">Users Management</h2>
      <p className="text-muted mb-4">
        Welcome to the User Management section. This module is designed to
        manage and monitor registered users stored in the database through
        FastAPI services. User data displayed in this section is fetched
        dynamically from the database using secure FastAPI APIs. Access to this
        module is protected through AWS Cognito authentication, where only
        authenticated users can view and manage user records. This section
        allows administrators to view user profiles, search users, apply
        pagination for large datasets, update user information, and delete
        records when required. All operations such as fetching, editing and
        removing users are performed through protected API endpoints with token
        verification. The data shown here includes user details such as name,
        email, mobile, address, city and profile information retrieved from the
        backend. FastAPI processes the requests, communicates with the database,
        and returns structured data to be displayed dynamically in the
        interface. This user management module demonstrates secure
        authentication, API integration, CRUD operations, and database-driven
        record handling using an industry-standard full stack architecture.
      </p>
    </Container>
  );
}

export default Users;
