import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi trước khi gửi request
  
    try {
      const formData = new URLSearchParams();
      formData.append("phone", phone);
      formData.append("password", password);
  
      const response = await axios.post("http://localhost:8080/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Gửi request giống Postman
        },
      });
  
      if (response.data.message.includes("Đăng nhập thành công")) {
        localStorage.setItem("user", JSON.stringify(response.data)); // Lưu vào localStorage
        navigate("/dashboard"); // Chuyển hướng đến dashboard
      } else {
        setError(response.data.message); // Hiển thị lỗi nếu đăng nhập thất bại
      }
    } catch (error) {
      setError("Lỗi kết nối! Vui lòng thử lại.");
    }
  };
  

  return (

        <div className="bg-green-600 flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
            <form>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div className="mb-4 text-right">
                <a href="#" className="text-green-600 hover:underline">
                  quên mật khẩu?
                </a>
              </div>
              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
            <p className="text-center text-gray-600">
             Bạn chưa có tài khoản?{' '}
              <a href="#" className="text-green-600 hover:underline">
                Đăng ký
              </a>
            </p>
          </div>
        </div>
    

    
   );
};

export default Login;
