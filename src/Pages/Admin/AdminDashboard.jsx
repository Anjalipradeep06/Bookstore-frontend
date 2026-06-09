import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "./AdminDashboard.css";
import Modal from "react-bootstrap/Modal";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const initialBookForm = {
    title: "",
    author: "",
    category: "",
    description: "",
    price: "",
  };

  // DATA
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showBookModal, setShowBookModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editBookId, setEditBookId] = useState(null);

  const [categoryName, setCategoryName] = useState("");

  const [bookForm, setBookForm] = useState(initialBookForm);
  const [editBookForm, setEditBookForm] = useState(initialBookForm);

  const [bookImage, setBookImage] = useState(null);
  const [editBookImage, setEditBookImage] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  // ================= PAGINATION STATE =================
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 10;

  // ================= DASHBOARD =================

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setData(res.data.dashboard);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  // ================= USERS =================

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      await api.put(`/admin/users/${id}/status`);
      toast.success("User status updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  // const deleteUser = async (id) => {
  //   try {
  //     await api.delete(`/admin/users/${id}`);
  //     toast.success("User deleted");
  //     fetchUsers();
  //   } catch {
  //     toast.error("Failed to delete user");
  //   }
  // };

  // ================= BOOKS =================

  const fetchBooks = async (pageNum = 1) => {
    try {
      const res = await api.get(`/admin/books?page=${pageNum}&limit=${booksPerPage}`);
      setBooks(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load books");
    }
  };

  useEffect(() => {
    if (activeTab === "books") {
      fetchBooks(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeTab]);

  const addBook = async () => {
    if (!bookForm.title || !bookForm.author || !bookForm.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!bookImage) {
      toast.error("Please select a book image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", bookForm.title);
      formData.append("author", bookForm.author);
      formData.append("category", bookForm.category);
      formData.append("description", bookForm.description);
      formData.append("price", bookForm.price);
      formData.append("image", bookImage);

      await api.post("/admin/books/create", formData);

      toast.success("Book added successfully");
      setShowBookModal(false);
      setBookForm({
        ...initialBookForm,
        category: categories.length > 0 ? categories[0].name : "",
      });
      setBookImage(null);
      setPage(1);
      fetchBooks(1);
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add book");
    }
  };

  const openEditModal = (book) => {
    setEditBookId(book._id);
    setEditBookForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      description: book.description || "",
      price: book.price || "",
    });
    setEditBookImage(null);
    setShowEditModal(true);
  };

  const editBook = async () => {
    if (!editBookForm.title || !editBookForm.author || !editBookForm.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", editBookForm.title);
      formData.append("author", editBookForm.author);
      formData.append("category", editBookForm.category);
      formData.append("description", editBookForm.description);
      formData.append("price", editBookForm.price);

      if (editBookImage) {
        formData.append("image", editBookImage);
      }

      await api.put(`/admin/books/${editBookId}`, formData);

      toast.success("Book updated successfully");
      setShowEditModal(false);
      setEditBookId(null);
      setEditBookImage(null);
      fetchBooks(page);
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update book");
    }
  };

  const deleteBook = async (id) => {
    try {
      await api.delete(`/admin/books/${id}`);
      toast.success("Book deleted");
      fetchDashboard();
      const newPage = books.length === 1 && page > 1 ? page - 1 : page;
      setPage(newPage);
      fetchBooks(newPage);
    } catch {
      toast.error("Failed to delete book");
    }
  };

  // ================= ORDERS =================

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data.data);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      toast.success("Order updated");
      fetchOrders();
      fetchDashboard();
    } catch {
      toast.error("Failed to update order");
    }
  };

  // ================= BANNERS =================

  const fetchBanners = async () => {
    try {
      const res = await api.get("/products/banners");
      setBanners(res.data.data);
    } catch {
      toast.error("Failed to load banners");
    }
  };

  const addBanner = async () => {
    if (!bannerFile) {
      toast.error("Please select a banner image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", bannerFile);
      await api.post("/admin/banners/create", formData);
      toast.success("Banner added");
      setBannerFile(null);
      fetchBanners();
    } catch {
      toast.error("Failed to add banner");
    }
  };

  const activateBanner = async (id) => {
    try {
      await api.put(`/admin/banners/activate/${id}`);
      toast.success("Banner updated");
      fetchBanners();
    } catch {
      toast.error("Failed to update banner");
    }
  };

  // ================= CATEGORIES =================

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const addCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      await api.post("/admin/categories", { name: categoryName });
      toast.success("Category added");
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchDashboard();
    fetchCategories();
  }, []);

useEffect(() => {
  if (categories.length > 0 && !bookForm.category) {
    setBookForm((prev) => ({
      ...prev,
      category: categories[0].name,
    }));
  }
}, [categories, bookForm.category]);

  // ================= TAB CHANGE =================

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "books") {
      setPage(1);
      fetchBooks(1);
    }
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "banners") fetchBanners();
    if (activeTab === "categories") fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ================= CHART DATA =================

  if (!data) return <h3>Loading...</h3>;

  const booksUsersData = {
    labels: ["Books", "Users"],
    datasets: [
      {
        data: [data.totalBooks, data.totalUsers],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const categoryData = {
    labels: data.booksByCategory?.map((item) => item._id) || [],
    datasets: [
      {
        data: data.booksByCategory?.map((item) => item.count) || [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const revenueData = {
    labels: ["Revenue"],
    datasets: [
      {
        label: "Revenue ₹",
        data: [data.totalRevenue],
        backgroundColor: ["#4CAF50"],
      },
    ],
  };

  // ================= HELPERS =================

  const getStatusBadge = (status) => (
    <span className={`order-status-badge ${status}`}>{status}</span>
  );

  // ================= RENDER =================

  return (
    <div className="admin-layout">

      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        <h2>BookVerse Admin</h2>
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          👤 Manage Users
        </button>
        <button
          className={activeTab === "books" ? "active" : ""}
          onClick={() => setActiveTab("books")}
        >
          📚 Manage Books
        </button>
        <button
          className={activeTab === "categories" ? "active" : ""}
          onClick={() => setActiveTab("categories")}
        >
          🏷 Manage Categories
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          🛒 Manage Orders
        </button>
        <button
          className={activeTab === "banners" ? "active" : ""}
          onClick={() => setActiveTab("banners")}
        >
          🖼 Manage Banners
        </button>
      </div>

      {/* ================= MAIN ================= */}
      <div className="main">

        {/* ===== DASHBOARD ===== */}
        {activeTab === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <div className="cards">
              <div className="card">Books<br />{data.totalBooks}</div>
              <div className="card">Users<br />{data.totalUsers}</div>
              <div className="card">Orders<br />{data.totalOrders}</div>
              <div className="card">Revenue<br />₹{data.totalRevenue}</div>
            </div>
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Books vs Users</h3>
                <Pie data={booksUsersData} />
              </div>
              <div className="chart-card">
                <h3>Books By Category</h3>
                <Pie data={categoryData} />
              </div>
              <div className="chart-card">
                <h3>Total Revenue</h3>
                <Bar data={revenueData} />
              </div>
            </div>
          </>
        )}

        {/* ===== USERS ===== */}
        {activeTab === "users" && (
          <div>
            <h2>Manage Users</h2>
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button onClick={() => toggleUserStatus(user._id)}>
                        {user.isActive ? "Block" : "Activate"}
                      </button>
                      {/* <button
                        className="delete-user"
                        onClick={() => deleteUser(user._id)}
                      >
                        <img className="button-del-user" src="/images/delete.png" alt="delete" />
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== CATEGORIES ===== */}
        {activeTab === "categories" && (
          <div>
            <h2>Manage Categories</h2>
            <div className="category-form">
              <input
                type="text"
                className="form-control"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <button className="btn btn-success" onClick={addCategory}>
                Add
              </button>
            </div>
            <table className="category-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>{cat.name}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteCategory(cat._id)}
                      >
                        <img src="/images/delete.png" alt="delete" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== BOOKS ===== */}
        {activeTab === "books" && (
          <div>
            <h2>Manage Books</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowBookModal(true)}
            >
              ➕ Add Book
            </button>
            <table className="books-table">
              <thead>
                <tr>
                  <th>Book ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>{book._id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>₹{book.price}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="del-book-btn"
                          onClick={() => openEditModal(book)}
                        >
                          <img src="/images/pen.png" alt="edit" />
                        </button>
                        <button
                          className="del-book-btn"
                          onClick={() => deleteBook(book._id)}
                        >
                          <img src="/images/delete.png" alt="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ================= PAGINATION ================= */}
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {activeTab === "orders" && (
          <div>
            <h2>Manage Orders</h2>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Book</th>
                  <th>Status</th>
                  <th>Update Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="order-id-cell">{order._id}</td>
                    <td>{order.userId?.name}</td>
                    <td>{order.bookId?.title}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <select
                        className="order-status-select"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="view-more-btn"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== BANNERS ===== */}
        {activeTab === "banners" && (
          <div>
            <h2>Manage Banners</h2>
            <input
              type="file"
              onChange={(e) => setBannerFile(e.target.files[0])}
            />
            <button className="btn btn-primary" onClick={addBanner}>
              ➕ Add Banner
            </button>
            {banners.map((b) => (
              <div className="banner-card" key={b._id}>
                <img src={b.imageUrl} alt="banner" width="200" />
                <label className="banner-toggle">
                  <input
                    type="checkbox"
                    checked={b.isActive}
                    onChange={() => activateBanner(b._id)}
                  />
                  Active
                </label>
              </div>
            ))}
          </div>
        )}

        {/* ================= ADD BOOK MODAL ================= */}
        <Modal
          show={showBookModal}
          onHide={() => setShowBookModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Book Title"
              value={bookForm.title}
              onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Author"
              value={bookForm.author}
              onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
            />
            <select
              className="form-control mb-3"
              value={bookForm.category}
              onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <textarea
              className="form-control mb-3"
              rows="4"
              placeholder="Description"
              value={bookForm.description}
              onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
            />
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Price"
              value={bookForm.price}
              onChange={(e) => setBookForm({ ...bookForm, price: e.target.value })}
            />
            <input
              type="file"
              className="form-control"
              onChange={(e) => setBookImage(e.target.files[0])}
            />
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => setShowBookModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-success" onClick={addBook}>
              Save Book
            </button>
          </Modal.Footer>
        </Modal>

        {/* ================= EDIT BOOK MODAL ================= */}
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Book Title"
              value={editBookForm.title}
              onChange={(e) => setEditBookForm({ ...editBookForm, title: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Author"
              value={editBookForm.author}
              onChange={(e) => setEditBookForm({ ...editBookForm, author: e.target.value })}
            />
            <select
              className="form-control mb-3"
              value={editBookForm.category}
              onChange={(e) => setEditBookForm({ ...editBookForm, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <textarea
              className="form-control mb-3"
              rows="4"
              placeholder="Description"
              value={editBookForm.description}
              onChange={(e) => setEditBookForm({ ...editBookForm, description: e.target.value })}
            />
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Price"
              value={editBookForm.price}
              onChange={(e) => setEditBookForm({ ...editBookForm, price: e.target.value })}
            />
            <input
              type="file"
              className="form-control"
              onChange={(e) => setEditBookImage(e.target.files[0])}
            />
            <small className="text-muted">Leave image empty to keep the existing image.</small>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-success" onClick={editBook}>
              Update Book
            </button>
          </Modal.Footer>
        </Modal>

        {/* ================= ORDER DETAILS MODAL ================= */}
        <Modal
          show={showOrderModal}
          onHide={() => { setShowOrderModal(false); setSelectedOrder(null); }}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Order ID</th>
                    <td>{selectedOrder._id}</td>
                  </tr>
                  <tr>
                    <th>User ID</th>
                    <td>{selectedOrder.userId?._id}</td>
                  </tr>
                  <tr>
                    <th>User Name</th>
                    <td>{selectedOrder.userId?.name}</td>
                  </tr>
                  <tr>
                    <th>User Email</th>
                    <td>{selectedOrder.userId?.email}</td>
                  </tr>
                  <tr>
                    <th>Book ID</th>
                    <td>{selectedOrder.bookId?._id}</td>
                  </tr>
                  <tr>
                    <th>Book Title</th>
                    <td>{selectedOrder.bookId?.title}</td>
                  </tr>
                  <tr>
                    <th>Author</th>
                    <td>{selectedOrder.bookId?.author}</td>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <td>₹{selectedOrder.bookId?.price}</td>
                  </tr>
                  <tr>
                    <th>Quantity</th>
                    <td>{selectedOrder.quantity ?? 1}</td>
                  </tr>
                  <tr>
                    <th>Total Amount</th>
                    <td>₹{selectedOrder.totalAmount ?? selectedOrder.bookId?.price}</td>
                  </tr>
                  <tr>
                    <th>Shipping Address</th>
                    <td>
                      {selectedOrder.shippingAddress ? (
                        <>
                          {selectedOrder.shippingAddress.street && (
                            <div>{selectedOrder.shippingAddress.street}</div>
                          )}
                          {selectedOrder.shippingAddress.city && (
                            <div>{selectedOrder.shippingAddress.city}</div>
                          )}
                          {selectedOrder.shippingAddress.state && (
                            <div>{selectedOrder.shippingAddress.state}</div>
                          )}
                          {selectedOrder.shippingAddress.pincode && (
                            <div>{selectedOrder.shippingAddress.pincode}</div>
                          )}
                          {selectedOrder.shippingAddress.country && (
                            <div>{selectedOrder.shippingAddress.country}</div>
                          )}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Payment Method</th>
                    <td>{selectedOrder.paymentMethod ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Payment Status</th>
                    <td>{selectedOrder.paymentStatus ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Order Status</th>
                    <td>{getStatusBadge(selectedOrder.status)}</td>
                  </tr>
                  <tr>
                    <th>Ordered At</th>
                    <td>
                      {selectedOrder.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => { setShowOrderModal(false); setSelectedOrder(null); }}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
}

export default AdminDashboard;