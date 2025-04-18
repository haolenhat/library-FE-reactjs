import React, { useState, useEffect } from 'react';

const ManageBorrower = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBorrower, setEditingBorrower] = useState(null);
  const [editForm, setEditForm] = useState({ borrowerCode: '', fullName: '' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const fetchBorrowers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/api/borrowers/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch borrowers data');
      }
      
      const data = await response.json();
      setBorrowers(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleEdit = (borrower) => {
    setEditingBorrower(borrower);
    setEditForm({
      borrowerCode: borrower.borrowerCode,
      fullName: borrower.fullName
    });
  };

  const handleCancelEdit = () => {
    setEditingBorrower(null);
    setEditForm({ borrowerCode: '', fullName: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:8080/api/borrowers/edit/${editForm.borrowerCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update borrower');
      }

      // Refresh borrowers list
      await fetchBorrowers();
      
      // Reset edit form and show notification
      setEditingBorrower(null);
      showNotification('Cập nhật thành công!', 'success');
    } catch (err) {
      showNotification(`Lỗi: ${err.message}`, 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });

    // Auto hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-4">
        <strong className="font-bold">Lỗi!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Quản lý người mượn</h1>
      
      {/* Notification */}
      {notification.show && (
        <div className={`mb-4 px-4 py-3 rounded relative ${
          notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 
          'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <span className="block sm:inline">{notification.message}</span>
        </div>
      )}
      
      {/* Edit Form */}
      {editingBorrower && (
        <div className="mb-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Chỉnh sửa thông tin người mượn</h2>
          <form onSubmit={handleSubmitEdit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="borrowerCode">
                Mã người mượn
              </label>
              <input
                id="borrowerCode"
                name="borrowerCode"
                type="text"
                value={editForm.borrowerCode}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                disabled
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                Họ và tên
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={editForm.fullName}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">STT</th>
                <th className="py-3 px-6 text-left">Mã người mượn</th>
                <th className="py-3 px-6 text-left">Họ và tên</th>
                <th className="py-3 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {borrowers.length > 0 ? (
                borrowers.map((borrower, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{borrower.borrowerCode || "N/A"}</td>
                    <td className="py-3 px-6">{borrower.fullName || "N/A"}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleEdit(borrower)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md text-xs"
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 px-6 text-center text-gray-500">
                    Không có dữ liệu người mượn
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBorrower;