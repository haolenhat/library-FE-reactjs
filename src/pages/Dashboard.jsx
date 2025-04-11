import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const dashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchUsers();
  }, []);

  // Filter users based on search term (name, email, or phone)
  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
  );

  // Handle checkbox selection
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.user_id));
    }
  };

  // Export to CSV functionality
  const exportToCSV = () => {
    const csvHeader = "ID,Họ tên,Email,Số điện thoại,Vai trò\n";
    const csvRows = filteredUsers.map(
      (user) =>
        `"${user.user_id}","${user.full_name}","${user.email}","${user.phone}","${user.role}"`
    );

    const csvContent = "\uFEFF" + csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get appropriate badge color based on role
  const getRoleBadgeClass = (role) => {
    return role === "ADMIN" 
      ? "bg-red-500 text-white px-2 py-1 rounded"
      : "bg-blue-500 text-white px-2 py-1 rounded";
  };

  // Navigation functions
  const handleAuthorManagement = () => {
    navigate("/ManageAuthors"); // Chuyển hướng đến trang quản lý tác giả
  };

  const handlePublisherManagement = () => {
    navigate("/ManagePublishers"); // Chuyển hướng đến trang quản lý nhà xuất bản
  };

  const handleCategoryManagement = () => {
    navigate("/ManageCategory"); // Chuyển hướng đến trang quản lý loại sách
  };

  const handleBookManagement = () => {
    navigate("/ManageBook"); // Chuyển hướng đến trang quản lý thông tin sách
  };
  const handleUserManagement = () => {
    navigate("/ManageEmployeesInfos"); // Chuyển hướng đến trang quản lý thông tin người dùng
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa dữ liệu đăng nhập
    navigate("/"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/5 bg-teal-500 text-white min-h-screen">
        <div className="p-4 text-lg font-bold">QUẢN LÍ THƯ VIỆN Nhóm 3</div>
        <ul className="space-y-2">
          <li className="p-2 hover:bg-teal-600 cursor-pointer" onClick={handleAuthorManagement}>Quản lý Tác giả</li>
          <li className="p-2 hover:bg-teal-600 cursor-pointer" onClick={handlePublisherManagement}>Quản lý Nhà Xuất Bản</li>
          <li className="p-2 hover:bg-teal-600 cursor-pointer" onClick={handleCategoryManagement}>Quản lý Loại Sách</li>
          <li className="p-2 hover:bg-teal-600 cursor-pointer" onClick={handleBookManagement}>Quản Thông Tin Sách</li>
          <li className="p-2 hover:bg-teal-600 cursor-pointer" onClick={handleUserManagement}>Quản lý Người Dùng</li>
          <li className="p-2 hover:bg-teal-600 cursor-pointer mt-8 text-red-200" onClick={handleLogout}>
            Đăng xuất
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-4/5 bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Quản lý người dùng</h1>
          <div className="flex items-center space-x-2">
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={exportToCSV}
            >
              Xuất CSV
            </button>
          </div>
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

        {isLoading ? (
          <div className="text-center py-4">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-teal-100">
                  <th className="border border-gray-300 p-2">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} 
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="border border-gray-300 p-2">ID</th>
                  <th className="border border-gray-300 p-2">Họ tên</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Số điện thoại</th>
                  <th className="border border-gray-300 p-2">Vai trò</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td className="border border-gray-300 p-2">
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(user.user_id)}
                        onChange={() => handleSelectUser(user.user_id)}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">{user.user_id}</td>
                    <td className="border border-gray-300 p-2">{user.full_name}</td>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                    <td className="border border-gray-300 p-2">{user.phone}</td>
                    <td className="border border-gray-300 p-2">
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role}
                      </span>
                    </td>
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
    </div>
  );
};

export default dashboard;