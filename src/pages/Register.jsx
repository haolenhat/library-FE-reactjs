import React from "react";

const Register = () => {
  return (

<div class="bg-green-600 flex items-center justify-center min-h-screen">

                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                    <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>
                    <form>
                        <div className="mb-4">
                            <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div className="mb-4">
                            <input type="email" placeholder="Enter your phone" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div className="mb-4">
                            <input type="password" placeholder="Create a password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div className="mb-6">
                            <input type="password" placeholder="Confirm your password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">Đăng ký</button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-4">bạn đã có tài khoản? <a href="#" className="text-green-500">Đăng nhập</a></p>
                </div>
  
    </div>
   );
};

export default Register;
