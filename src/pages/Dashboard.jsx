import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [users, setUsers] = useState([]); // Danh sách user
  const [search, setSearch] = useState(""); // Giá trị tìm kiếm
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/all"); // API lấy danh sách user
        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchUsers();
  }, []);

  // Lọc danh sách user theo tên hoặc số điện thoại
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.phone.includes(search)
  );

  // Xuất file CSV
  const exportToCSV = () => {
    const csvHeader = "NO,Tên,Số điện thoại\n"; // Tiêu đề cột
    const csvRows = filteredUsers.map((user) =>
      `"${user.createdAt}","${user.name}","${user.phone}"`
    );
  
    const csvContent = "\uFEFF" + csvHeader + csvRows.join("\n"); // Thêm BOM (UTF-8)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" }); // Đảm bảo UTF-8
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  
  
  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa dữ liệu đăng nhập
    navigate("/"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className="flex">
    {/* Sidebar */}
    <div className="w-1/5 bg-teal-500 text-white">
        <div className="p-4 text-lg font-bold">QUẢN LÍ THƯ VIỆN Nhóm 3</div>
        <ul className="space-y-2">
            <li className="p-2 hover:bg-teal-600 cursor-pointer">Trang chủ</li>
            <li className="p-2 hover:bg-teal-600 cursor-pointer">Hệ thống</li>
            <li className="p-2 hover:bg-teal-600 cursor-pointer">Danh mục</li>
            <li className="p-2 hover:bg-teal-600 cursor-pointer">Quản lý kho kệ</li>
            <li className="p-2 hover:bg-teal-600 cursor-pointer">Quản lý xuất nhập</li>
            <li className="p-2 hover:bg-teal-600 cursor-pointer">Quản lý mượn trả</li>
            <li className="p-2 hover:bg-teal-600 cursor-pointer">Báo cáo</li>
        </ul>
    </div>
    {/* Main Content */}
    <div className="w-4/5 bg-white p-4">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Tài khoản</h1>
            <div className="flex items-center space-x-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Thêm</button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Sửa</button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Reset password</button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Xóa</button>
            </div>
        </div>
        <div className="flex space-x-2 mb-4">
            <select className="border border-gray-300 p-2 rounded">
                <option>Lọc theo tên</option>
            </select>
            <select className="border border-gray-300 p-2 rounded">
                <option>Lọc theo số điện thoại</option>
            </select>
            <input type="text" className="border border-gray-300 p-2 rounded flex-grow" placeholder="Tìm kiếm" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded"><i className="fas fa-search"></i></button>
        </div>
        <table className="w-full border-collapse border border-gray-300">
            <thead>
                <tr className="bg-teal-100">
                    <th className="border border-gray-300 p-2"><input type="checkbox" /></th>
                    <th className="border border-gray-300 p-2">Tài khoản</th>
                    <th className="border border-gray-300 p-2">Họ tên</th>
                    <th className="border border-gray-300 p-2">Điện thoại</th>
                    <th className="border border-gray-300 p-2">Email</th>
                    <th className="border border-gray-300 p-2">Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border border-gray-300 p-2"><input type="checkbox" /></td>
                    <td className="border border-gray-300 p-2">Admin</td>
                    <td className="border border-gray-300 p-2">Administrator</td>
                    <td className="border border-gray-300 p-2">0912345678</td>
                    <td className="border border-gray-300 p-2">Administrator@gmail.c</td>
                    <td className="border border-gray-300 p-2"><span className="bg-green-500 text-white px-2 py-1 rounded">Kích hoạt</span></td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-2"><input type="checkbox" /></td>
                    <td className="border border-gray-300 p-2">demo</td>
                    <td className="border border-gray-300 p-2">demo</td>
                    <td className="border border-gray-300 p-2">0987654321</td>
                    <td className="border border-gray-300 p-2">abc@tcsoft.vn</td>
                    <td className="border border-gray-300 p-2"><span className="bg-green-500 text-white px-2 py-1 rounded">Kích hoạt</span></td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-2"><input type="checkbox" /></td>
                    <td className="border border-gray-300 p-2">521TCN1001</td>
                    <td className="border border-gray-300 p-2">Nguyễn Thị Vân Anh</td>
                    <td className="border border-gray-300 p-2">12345</td>
                    <td className="border border-gray-300 p-2">521TCN1001</td>
                    <td className="border border-gray-300 p-2"><span className="bg-green-500 text-white px-2 py-1 rounded">Kích hoạt</span></td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-2"><input type="checkbox" /></td>
                    <td className="border border-gray-300 p-2">520YCT1001</td>
                    <td className="border border-gray-300 p-2">Phó Long An</td>
                    <td className="border border-gray-300 p-2">0395025459</td>
                    <td className="border border-gray-300 p-2">Phó Long An</td>
                    <td className="border border-gray-300 p-2"><span className="bg-green-500 text-white px-2 py-1 rounded">Kích hoạt</span></td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-2"><input type="checkbox" /></td>
                    <td className="border border-gray-300 p-2">nguyenhai</td>
                    <td className="border border-gray-300 p-2">Trần Nguyên Hải</td>
                    <td className="border border-gray-300 p-2">12345</td>
                    <td className="border border-gray-300 p-2">nahai.haui@gmail.c</td>
                    <td className="border border-gray-300 p-2"><span className="bg-green-500 text-white px-2 py-1 rounded">Kích hoạt</span></td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-2"><input type="checkbox" /></td>
                    <td className="border border-gray-300 p-2">521TCN1002</td>
                    <td className="border border-gray-300 p-2">Trần Thị Ngọc Anh</td>
                    <td className="border border-gray-300 p-2">12345</td>
                    <td className="border border-gray-300 p-2">521TCN1002</td>
                    <td className="border border-gray-300 p-2"><span className="bg-green-500 text-white px-2 py-1 rounded">Kích hoạt</span></td>
                </tr>
            </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
            <div>Tổng: 6 bản ghi</div>
            <div className="flex items-center space-x-2">
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">1</button>
                <select className="border border-gray-300 p-2 rounded">
                    <option>20 / trang</option>
                </select>
            </div>
        </div>
    </div>
</div>
  );
};

export default Dashboard;
