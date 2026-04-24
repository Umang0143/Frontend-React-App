import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "aws-amplify/auth";
import "../assets/css/dashboard.css";

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
  const [remainingMs, setRemainingMs] = useState(0);

  const [search, setSearch] = useState("");

  const limit = 8;
  const navigate = useNavigate();

  // FETCH USERS
  const fetchUsers = async (pageNo) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://127.0.0.1:8000/users?page=${pageNo}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page, search]); // 🔥 search add kiya

  const totalPages = Math.ceil(total / limit);

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
      await axios.delete(`http://127.0.0.1:8000/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Deleted Successfully");
      fetchUsers(page);
    } catch {
      toast.error("Delete failed");
    }
  };

  // EDIT
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

  // SAVE
  const handleSave = async (id) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/update/${id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Updated Successfully");

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
    <Container className="mt-4">

      {/* HEADER */}
      <Card className="p-4 mb-4 border-0 shadow-lg rounded-4 header-card">
        <div className="d-flex flex-wrap justify-content-between align-items-center">

          <h3 className="fw-bold text-white">User Dashboard</h3>

          <div className="d-flex align-items-center flex-wrap gap-2">

            {/* TIMER */}
            <span className="timer-box">
              Timer:- {timeLeft}
            </span>

            {/* SEARCH */}
            <Form.Control
              type="text"
              placeholder="🔍 Search..."
              className="search-box"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            {/* LOGOUT */}
            <Button className="logout-btn" onClick={handleLogout}>
              Logout
            </Button>

          </div>
        </div>
      </Card>

      {/* CARDS */}
      <Row>
        {users.map((item) => (
          <Col md={3} key={item.id} className="mb-4">
            <Card className="user-card border-0 shadow-sm">

              {/* IMAGE */}
              <Card.Img
                variant="top"
                src={item.image || "https://picsum.photos/300/200"}
                loading="lazy"
                className="card-img"
              />

              <Card.Body>

                {/* NAME */}
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

                {/* DETAILS */}
                {editId === item.id ? (
                  <>
                    <Form.Control className="mb-2" name="email" value={editData.email} readOnly disabled onChange={handleChange} />
                    <Form.Control className="mb-2" name="mobile" value={editData.mobile} onChange={handleChange} />
                    <Form.Control className="mb-2" name="city" value={editData.city} onChange={handleChange} />
                    <Form.Control className="mb-2" name="address" value={editData.address} onChange={handleChange} />
                  </>
                ) : (
                  <>
                    <p className="text-muted small mb-1">{item.email}</p>
                    <p className="mb-1">📞 {item.mobile}</p>
                    <p className="mb-1">📍 {item.city}</p>
                    <p className="small text-muted">{item.address}</p>
                  </>
                )}

                {/* BUTTONS */}
                <div className="d-flex justify-content-between mt-3">
                  {editId === item.id ? (
                    <>
                      <Button size="sm" className="btn-success-custom" onClick={() => handleSave(item.id)}>
                        Save
                      </Button>

                      <Button size="sm" className="btn-cancel" onClick={() => setEditId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" className="btn-edit" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>

                      <Button size="sm" className="btn-delete" onClick={() => handleDelete(item.id)}>
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

    </Container>
  );
}

export default Dashboard;