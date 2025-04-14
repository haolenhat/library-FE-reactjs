import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageEmployeesInfos = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  // Form state for editing user - updated to include password
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "LIBRARIAN",
    password: ""
  });

  // Form state for adding new user
  const [addForm, setAddForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "LIBRARIAN",
    password: ""
  });

  // Check user authentication and role
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      // Redirect to login if user is not logged in
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setCurrentUserRole(user.role);
      
      // If not an admin, redirect to appropriate page
      if (user.role !== "ADMIN") {
        // You might want to show a message or redirect to a different page
        console.log("Non-admin users have limited access to this page");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Redirect to login in case of invalid data
      navigate("/login");
    }
  }, [navigate]);

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/api/users/all");
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term - updated property names
  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
  );

  // Handle edit user - updated to include empty password field
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: "" // Initialize with empty password
    });
    setIsEditModalOpen(true);
  };

  // Handle form change for edit form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  // Handle form change for add form
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm({
      ...addForm,
      [name]: value
    });
  };

  // Submit edit form - updated API call
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      // Make sure we're sending all required fields
      const dataToSend = {
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone,
        role: editForm.role,
        password: editForm.password
      };
      
      console.log("Sending data:", dataToSend);
      await axios.put(`http://localhost:8080/api/users/edit/${currentUser.userId}`, dataToSend);
      
      // Refresh user list
      await fetchUsers();
      
      // Close modal
      setIsEditModalOpen(false);
      setCurrentUser(null);
      
      // Show success notification
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert(`Failed to update user: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit add form
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      // Make sure we're sending all required fields
      const dataToSend = {
        fullName: addForm.fullName,
        email: addForm.email,
        phone: addForm.phone,
        role: addForm.role,
        password: addForm.password
      };
      
      console.log("Sending data for new user:", dataToSend);
      await axios.post("http://localhost:8080/api/users/create", dataToSend);
      
      // Refresh user list
      await fetchUsers();
      
      // Close modal and reset form
      setIsAddModalOpen(false);
      setAddForm({
        fullName: "",
        email: "",
        phone: "",
        role: "LIBRARIAN",
        password: ""
      });
      
      // Show success notification
      alert("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      alert(`Failed to add user: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete user - updated to use userId
  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete user
  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:8080/api/users/${deleteUserId}`);
      
      // Refresh user list
      await fetchUsers();
      
      // Reset selection
      setSelectedUsers(selectedUsers.filter(id => id !== deleteUserId));
      
      // Close modal
      setIsDeleteModalOpen(false);
      setDeleteUserId(null);
      
      // Show success notification
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(`Failed to delete user: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle checkbox selection - updated to use userId
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Handle select all checkbox - updated to use userId
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.userId));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    
    if (selectedUsers.length === 1) {
      // Single delete
      handleDeleteClick(selectedUsers[0]);
    } else {
      // Multiple delete confirmation
      if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
        // In a real application, you would implement a bulk delete API
        // For now, we'll delete them one by one
        const deletePromises = selectedUsers.map(userId => 
          axios.delete(`http://localhost:8080/api/users/${userId}`)
        );
        
        Promise.all(deletePromises)
          .then(() => {
            fetchUsers();
            setSelectedUsers([]);
            alert(`${selectedUsers.length} users deleted successfully!`);
          })
          .catch(error => {
            console.error("Error deleting users:", error);
            alert("Failed to delete some users. Please try again.");
          });
      }
    }
  };
  
  // Function to open Add User modal
  const openAddModal = () => {
    setAddForm({
      fullName: "",
      email: "",
      phone: "",
      role: "LIBRARIAN",
      password: ""
    });
    setIsAddModalOpen(true);
  };
  
  return (
    <div className="flex">

      {/* Main Content */}
      <div className="w-4/5 bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Quản lý người dùng</h1>
          
          {/* Only show action buttons for ADMIN users */}
          {currentUserRole === "ADMIN" && (
            <div className="flex items-center space-x-2">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded" 
                onClick={openAddModal}
              >
                Thêm mới
              </button>
              <button 
                className={`${selectedUsers.length === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} px-4 py-2 rounded`}
                disabled={selectedUsers.length !== 1}
                onClick={() => {
                  if (selectedUsers.length === 1) {
                    const selectedUser = users.find(user => user.userId === selectedUsers[0]);
                    if (selectedUser) handleEditUser(selectedUser);
                  }
                }}
              >
                Sửa
              </button>
              <button 
                className={`${selectedUsers.length > 0 ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'} px-4 py-2 rounded`}
                disabled={selectedUsers.length === 0}
                onClick={handleBulkDelete}
              >
                Xóa
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-2 mb-4">
          <input 
            type="text" 
            className="border border-gray-300 p-2 rounded flex-grow" 
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            <i className="fas fa-search"></i> Tìm kiếm
          </button>
        </div>

        {isLoading && !isEditModalOpen && !isDeleteModalOpen && !isAddModalOpen ? (
          <div className="text-center py-4">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-teal-100">
                  {currentUserRole === "ADMIN" && (
                    <th className="border border-gray-300 p-2">
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} 
                        onChange={handleSelectAll}
                      />
                    </th>
                  )}
                  <th className="border border-gray-300 p-2">ID</th>
                  <th className="border border-gray-300 p-2">Họ tên</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Số điện thoại</th>
                  <th className="border border-gray-300 p-2">Vai trò</th>
                  {currentUserRole === "ADMIN" && (
                    <th className="border border-gray-300 p-2">Thao tác</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    {currentUserRole === "ADMIN" && (
                      <td className="border border-gray-300 p-2">
                        <input 
                          type="checkbox" 
                          checked={selectedUsers.includes(user.userId)}
                          onChange={() => handleSelectUser(user.userId)}
                        />
                      </td>
                    )}
                    <td className="border border-gray-300 p-2">{user.userId}</td>
                    <td className="border border-gray-300 p-2">{user.fullName}</td>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                    <td className="border border-gray-300 p-2">{user.phone}</td>
                    <td className="border border-gray-300 p-2">
                      <span className={user.role === "ADMIN" ? "bg-red-500 text-white px-2 py-1 rounded" : "bg-blue-500 text-white px-2 py-1 rounded"}>
                        {user.role}
                      </span>
                    </td>
                    {currentUserRole === "ADMIN" && (
                      <td className="border border-gray-300 p-2">
                        <div className="flex space-x-2 justify-center">
                          <button 
                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                            onClick={() => handleEditUser(user)}
                          >
                            Sửa
                          </button>
                          <button 
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                            onClick={() => handleDeleteClick(user.userId)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <div>Tổng: {filteredUsers.length} bản ghi</div>
              <div className="flex items-center space-x-2">
                <button className="bg-teal-500 text-white px-4 py-2 rounded">1</button>
                <select className="border border-gray-300 p-2 rounded">
                  <option>20 / trang</option>
                  <option>50 / trang</option>
                  <option>100 / trang</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Sửa thông tin người dùng</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                  Họ tên
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                  Vai trò
                </label>
                <select
                  id="role"
                  name="role"
                  value={editForm.role}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="LIBRARIAN">Thủ thư</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Thêm người dùng mới</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="add-fullName">
                  Họ tên
                </label>
                <input
                  type="text"
                  id="add-fullName"
                  name="fullName"
                  value={addForm.fullName}
                  onChange={handleAddFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="add-email">
                  Email
                </label>
                <input
                  type="email"
                  id="add-email"
                  name="email"
                  value={addForm.email}
                  onChange={handleAddFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="add-phone">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="add-phone"
                  name="phone"
                  value={addForm.phone}
                  onChange={handleAddFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="add-password">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="add-password"
                  name="password"
                  value={addForm.password}
                  onChange={handleAddFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="add-role">
                  Vai trò
                </label>
                <select
                  id="add-role"
                  name="role"
                  value={addForm.role}
                  onChange={handleAddFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="LIBRARIAN">Thủ thư</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Thêm người dùng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="mb-6">Bạn có chắc chắn muốn xóa người dùng này không?</p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployeesInfos;