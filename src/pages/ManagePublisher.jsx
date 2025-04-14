import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePublishers = () => {
  const [publishers, setPublishers] = useState([]);
  const [newPublisher, setNewPublisher] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Lấy danh sách nhà xuất bản từ API
  const fetchPublishers = async () => {
    try {
      const res = await axios.get('/api/publishers/all');
      setPublishers(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách NXB:", error);
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  // Thêm nhà xuất bản mới
  const handleAddPublisher = async () => {
    if (newPublisher.trim() !== "") {
      try {
        const res = await axios.post('/api/publishers/add', {
          publisherName: newPublisher
        });
        setPublishers([...publishers, res.data]);
        setNewPublisher("");
      } catch (error) {
        console.error("Lỗi khi thêm NXB:", error);
        alert("Thêm thất bại!");
      }
    }
  };

  // Xoá nhà xuất bản
  const handleDeletePublisher = async (id) => {
    try {
      await axios.delete(`/api/publishers/delete/${id}`);
      setPublishers(publishers.filter(p => p.publisherId !== id));
    } catch (error) {
      console.error("Lỗi khi xoá NXB:", error);
      alert("Xoá thất bại!");
    }
  };

  // Bắt đầu chỉnh sửa
  const startEditing = (publisher) => {
    setEditingId(publisher.publisherId);
    setEditValue(publisher.publisherName);
  };

  // Lưu chỉnh sửa
  const saveEdit = async () => {
    if (editValue.trim() !== "") {
      try {
        const res = await axios.put(`/api/publishers/edit/${editingId}`, {
          publisherName: editValue
        });
        setPublishers(publishers.map(p =>
          p.publisherId === editingId ? res.data : p
        ));
        setEditingId(null);
        setEditValue("");
      } catch (error) {
        console.error("Lỗi khi cập nhật NXB:", error);
        alert("Cập nhật thất bại!");
      }
    }
  };

  const filteredPublishers = publishers.filter(p =>
    p.publisherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Quản Lý Nhà Xuất Bản</h1>

      {/* Tìm kiếm */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm nhà xuất bản..."
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Thêm nhà xuất bản */}
      <div className="mb-6 bg-blue-50 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">Thêm Nhà Xuất Bản Mới</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nhập tên nhà xuất bản mới..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newPublisher}
            onChange={(e) => setNewPublisher(e.target.value)}
          />
          <button
            onClick={handleAddPublisher}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Thêm
          </button>
        </div>
      </div>

      {/* Danh sách nhà xuất bản */}
      <div className="bg-white rounded shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">
          Danh Sách Nhà Xuất Bản ({filteredPublishers.length})
        </h2>

        {filteredPublishers.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 font-semibold w-16">ID</th>
                <th className="p-3 font-semibold">Tên Nhà Xuất Bản</th>
                <th className="p-3 font-semibold w-32 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPublishers.map(publisher => (
                <tr key={publisher.publisherId} className="border-t hover:bg-gray-50">
                  <td className="p-3">{publisher.publisherId}</td>
                  <td className="p-3">
                    {editingId === publisher.publisherId ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      publisher.publisherName
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    {editingId === publisher.publisherId ? (
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Lưu
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(publisher)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Sửa
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePublisher(publisher.publisherId)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-center text-gray-500">Không tìm thấy nhà xuất bản nào</p>
        )}
      </div>
    </div>
  );
};

export default ManagePublishers;