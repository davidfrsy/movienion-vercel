import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Spinner,
  Alert,
  Form,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext.jsx";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const { user } = useAuth();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/users", {
        headers: { "x-auth-token": token },
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Gagal mengambil data user.");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      const updatedUser = await response.json();
      if (!response.ok)
        throw new Error(updatedUser.error || "Gagal mengubah role.");

      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      toast.success(`Role untuk ${updatedUser.name} berhasil diubah.`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredItems = users.filter(
    (item) =>
      (item.name &&
        item.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.email &&
        item.email.toLowerCase().includes(filterText.toLowerCase()))
  );

  const columns = [
    { name: "#", selector: (row, index) => index + 1, width: "50px" },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,

      cell: (row) => (
        <span
          className={`badge bg-${
            row.role === "admin"
              ? "danger"
              : row.role === "author"
              ? "primary"
              : "secondary"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      name: "Joined",
      selector: (row) => format(new Date(row.created_at), "d MMM yyyy"),
      sortable: true,
    },
    {
      name: "Actions",
      center: true,
      cell: (row) =>
        row.id === user.id ? (
          <span className="text-muted">You</span>
        ) : (
          <DropdownButton
            variant="outline-secondary"
            title="Change Role"
            size="sm"
            onSelect={(eventKey) => handleChangeRole(row.id, eventKey)}
          >
            <Dropdown.Item eventKey="user">Set as User</Dropdown.Item>
            <Dropdown.Item eventKey="author">Set as Author</Dropdown.Item>
            {/* <Dropdown.Item eventKey="admin">Set as Admin</Dropdown.Item> */}
          </DropdownButton>
        ),
    },
  ];

  const subHeaderComponent = useMemo(() => {
    return (
      <Form.Control
        type="text"
        placeholder="Search by name or email..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ maxWidth: "300px" }}
      />
    );
  }, [filterText]);

  if (isLoading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="my-5">
      <h2 className="mb-4">User Management</h2>
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        striped
        highlightOnHover
        subHeader
        subHeaderComponent={subHeaderComponent}
      />
    </Container>
  );
};

export default UserManagementPage;
