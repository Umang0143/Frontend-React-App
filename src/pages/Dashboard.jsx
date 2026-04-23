import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Dashboard() {

  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🔹 Fetch Data
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/getusers");
      setStudents(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load users");
    }
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete/${id}`);
      toast.success("Deleted successfully 🗑️");
      fetchStudents();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  // 🔹 Edit
  const handleEdit = (item) => {
    setEditId(item.id);

    setEditData({
      name: item.name,
      email: item.email,
      mobile: item.mobile
    });
  };

  // 🔹 Input Change
  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Save
  const handleSave = async (id) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/update/${id}`,
        {
          ...editData,
          password: "12345"
        }
      );

      toast.success("Updated Successfully ✅");

      setEditId(null);
      fetchStudents();

    } catch (err) {
      console.log(err);
      toast.error("Update failed ❌");
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // important
    toast.info("Logged out 👋");
    navigate("/");
  };

  return (
    <Container className="mt-5">

      <Card className="shadow-lg rounded-4 p-4">

        <div className="d-flex justify-content-between mb-4">
          <h2>Student Management Dashboard</h2>

          <Button
            variant="dark"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        <Table striped bordered hover>

          <thead className="table-primary">
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {students.map((item) => (

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

                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() => handleSave(item.id)}
                    >
                      Save
                    </Button>

                  ) : (

                    <Button
                      variant="info"
                      className="me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>

                  )}

                  <Button
                    variant="danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>

                </td>

              </tr>

            ))}

          </tbody>

        </Table>

      </Card>

    </Container>
  );
}

export default Dashboard;