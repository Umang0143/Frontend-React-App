import { useEffect, useState } from "react";
import { Container, Form, Row, Col, Card, Button, Navbar } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "aws-amplify/auth";

import API from "../services/api";
import "../assets/scss/dashboard.scss";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
  });

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [timeLeft, setTimeLeft] = useState("");

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const limit = 8;

  const navigate = useNavigate();

  /* Auth Check */
  useEffect(() => {
    const token =
      localStorage.getItem("idToken") || localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, []);

  /* Debounce Search */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // PAGINATION NUMBERS
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 1;

    let start = Math.max(1, page - 1);
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // ALL PAGE NUMBERS
  const getAllPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  /* Fetch Users */
  const fetchUsers = async (pageNo) => {
    try {
      const res = await API.get(
        `/users?page=${pageNo}&limit=${limit}&search=${search}`,
      );

      setUsers(res.data.data || []);

      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  fetchUsers(page);
}, [page, search]);

  const totalPages = Math.ceil(total / limit);

  /* Token Timer */
  useEffect(() => {
    const token =
      localStorage.getItem("idToken") || localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const interval = setInterval(() => {
        const remainingTime = payload.exp * 1000 - Date.now();

        if (remainingTime <= 0) {
          clearInterval(interval);

          localStorage.clear();

          navigate("/login");
        } else {
          const minutes = Math.floor(remainingTime / 60000);

          const seconds = Math.floor((remainingTime % 60000) / 1000);

          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    } catch (error) {
      localStorage.clear();
      navigate("/login");
    }
  }, []);

  /* Delete */
  const handleDelete = async (id) => {
    try {
      await API.delete(`/delete/${id}`);

      toast.success("Deleted Successfully");

      fetchUsers(page);
    } catch {
      toast.error("Delete failed");
    }
  };

  /* Edit */
  const handleEdit = (item) => {
    setEditId(item.id);

    setEditData({
      name: item.name || "",
      email: item.email || "",
      mobile: item.mobile || "",
      address: item.address || "",
      city: item.city || "",
    });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  /* Save */
  const handleSave = async (id) => {
    try {
      await API.put(`/update/${id}`, editData);

      toast.success("Updated Successfully");

      setEditId(null);

      fetchUsers(page);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <Container className="mt-4">
      <Navbar expand="lg" className="bg-white shadow rounded-4 px-4 py-3 mb-4">
        <Container fluid>
          <div
            className="d-flex justify-content-between align-items-center w-100 flex-wrap gap-3"
          >
            <div>
              <h4 className="fw-bold mb-0 text-primary">User Dashboard</h4>

              <small className="text-muted">
                Manage users and monitor activity
              </small>
            </div>

            <div
              className="d-flex align-items-center gap-3 flex-wrap"
            >
              <span className="timer-box bg-dark">Time:- {timeLeft}</span>

              <Form>
                <Form.Control
                  type="search"
                  placeholder="Search users..."
                  className="search-box"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </Form>
            </div>
          </div>
        </Container>
      </Navbar>

      <Row className="g-3">
        {users.map((item) => (
          <Col md={3} key={item.id} className="mb-4">
            <Card className="user-card border-0 rounded-4 p-4 shadow-sm">
              <img
                src={item.image || "https://picsum.photos/300/200"}
                className="rounded-circle mx-auto"
                width="100"
              />

              <Card.Body>
                {editId === item.id ? (
                  <Form.Control
                    className="mb-2"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                  />
                ) : (
                  <Card.Title className="fw-bold text-primary">
                    {item.name}
                  </Card.Title>
                )}

                {editId === item.id ? (
                  <>
                    <Form.Control
                      className="mb-2"
                      name="email"
                      value={editData.email}
                      readOnly
                      disabled
                    />

                    <Form.Control
                      className="mb-2"
                      name="mobile"
                      value={editData.mobile}
                      onChange={handleChange}
                    />

                    <Form.Control
                      className="mb-2"
                      name="city"
                      value={editData.city}
                      onChange={handleChange}
                    />

                    <Form.Control
                      className="mb-2"
                      name="address"
                      value={editData.address}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  <>
                    <p className="small text-muted">{item.email}</p>

                    <p>📞 {item.mobile}</p>

                    <p>📍 {item.city}</p>

                    <p className="small text-muted">{item.address}</p>
                  </>
                )}

                <div className="d-flex justify-content-between mt-3">
                  {editId === item.id ? (
                    <>
                      <Button size="sm" onClick={() => handleSave(item.id)}>
                        Save
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center align-items-center mt-3 flex-wrap">
        <Button variant="secondary" className="mx-1" disabled={page === 1} onClick={() => setPage(page - 1)}>⬅ Prev</Button>

        <span className={`mx-1 px-2 ${page === 1 ? "fw-bold" : ""}`}>1</span>

        {page > 2 && <span className="mx-1">...</span>}

        {page !== 1 && page !== totalPages && (
          <span className="mx-1 px-2 fw-bold">{page}</span>
        )}

        {page < totalPages - 1 && <span className="mx-1">...</span>}

        {totalPages > 1 && (
          <span className={`mx-1 px-2 ${page === totalPages ? "fw-bold" : ""}`}>
            {totalPages}
          </span>
        )}

        <Button variant="secondary" className="mx-1" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next ➡</Button>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-3 flex-wrap">

        {/* PREV */}
        <Button
          variant="outline-dark"
          className="mx-1 mb-1"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ⬅ Prev
        </Button>

        {/* PAGE NUMBERS */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <Button
            key={num}
            variant={num === page ? "dark" : "outline-dark"}
            className="mx-1 mb-1"
            onClick={() => setPage(num)}
          >
            {num}
          </Button>
        ))}

        {/* NEXT */}
        <Button
          variant="outline-dark"
          className="mx-1 mb-1"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next ➡
        </Button>

      </div>
    </Container>
  );
}

export default Dashboard;
