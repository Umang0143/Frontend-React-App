import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "aws-amplify/auth";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [timeLeft, setTimeLeft] = useState("");
  const [remainingMs, setRemainingMs] = useState(0);

  const limit = 10;
  const navigate = useNavigate();

  // PAGINATION API CALL
  const fetchUsers = async (pageNo) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/users?page=${pageNo}&limit=${limit}`,
      );

      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  // TOKEN TIMER
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    const interval = setInterval(() => {
      const remainingTime = payload.exp * 1000 - Date.now();

      setRemainingMs(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(interval);
        localStorage.clear();
        window.location.href = "/login";
      } else {
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);

        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete/${id}`);
      toast.success("Deleted");
      fetchUsers(page);
    } catch {
      toast.error("Delete failed");
    }
  };

  // EDIT
  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData({
      name: item.name,
      email: item.email,
      mobile: item.mobile,
    });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/update/${id}`, editData);
      toast.success("Updated");
      setEditId(null);
      fetchUsers(page);
    } catch {
      toast.error("Update failed");
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    await signOut();
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Container className="mt-5">
      {/* HEADER */}
      <Card className="shadow-lg p-4 rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">User Dashboard</h3>

          <div>
            <span
              style={{
                background: "#000",
                color: remainingMs < 60000 ? "red" : "#fff",
                padding: "6px 15px",
                borderRadius: "20px",
                marginRight: "10px",
              }}
            >
              {timeLeft}
            </span>

            <Button variant="dark" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <Table striped bordered hover responsive>
          <thead className="table-dark text-center">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>City</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>

                <td>
                  {editId === item.id ? (
                    <Form.Control
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    item.name
                  )}
                </td>

                <td>
                  {editId === item.id ? (
                    <Form.Control
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    item.email
                  )}
                </td>

                <td>
                  {editId === item.id ? (
                    <Form.Control
                      name="mobile"
                      value={editData.mobile}
                      onChange={handleChange}
                    />
                  ) : (
                    item.mobile
                  )}
                </td>
                <td>
                  {editId === item.id ? (
                    <Form.Control
                      name="city"
                      value={editData.city}
                      onChange={handleChange}
                    />
                  ) : (
                    item.city
                  )}
                </td>
                <td>
                  {editId === item.id ? (
                    <Form.Control
                      name="address"
                      value={editData.address}
                      onChange={handleChange}
                    />
                  ) : (
                    item.address
                  )}
                </td>

                <td className="text-center">
                  {editId === item.id ? (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleSave(item.id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>
                  )}

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* PAGINATION */}
        <div className="d-flex justify-content-center align-items-center mt-3">
          <Button
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ⬅ Prev
          </Button>

          <span className="mx-3 fw-bold">
            Page {page} / {totalPages}
          </span>

          <Button
            variant="secondary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next ➡
          </Button>
        </div>
      </Card>
    </Container>
  );
}

export default Dashboard;
