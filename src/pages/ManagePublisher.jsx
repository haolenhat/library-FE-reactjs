import React, { useState } from 'react';

const ManagePublishers = () => {
  // Dữ liệu mẫu cho nhà xuất bản
  const [publishers, setPublishers] = useState([
    { publisher_id: 1, publisher_name: "NXB Kim Đồng" },
    { publisher_id: 2, publisher_name: "NXB Trẻ" },
    { publisher_id: 3, publisher_name: "NXB Văn Học" },
    { publisher_id: 4, publisher_name: "NXB Tổng Hợp TPHCM" },
    { publisher_id: 5, publisher_name: "NXB Giáo Dục" },
    { publisher_id: 6, publisher_name: "NXB Hội Nhà Văn" },
    { publisher_id: 7, publisher_name: "NXB Phụ Nữ" }
  ]);

  const [newPublisher, setNewPublisher] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Hàm thêm nhà xuất bản mới (giả lập)
  const handleAddPublisher = () => {
    if (newPublisher.trim() !== "") {
      const newId = Math.max(...publishers.map(p => p.publisher_id)) + 1;
      setPublishers([...publishers, { publisher_id: newId, publisher_name: newPublisher }]);
      setNewPublisher("");
    }
  };

  // Hàm xóa nhà xuất bản (giả lập)
  const handleDeletePublisher = (id) => {
    setPublishers(publishers.filter(publisher => publisher.publisher_id !== id));
  };

  // Hàm bắt đầu chỉnh sửa
  const startEditing = (publisher) => {
    setEditingId(publisher.publisher_id);
    setEditValue(publisher.publisher_name);
  };

  // Hàm lưu chỉnh sửa
  const saveEdit = () => {
    if (editValue.trim() !== "") {
      setPublishers(publishers.map(publisher => 
        publisher.publisher_id === editingId ? 
        { ...publisher, publisher_name: editValue } : publisher
      ));
      setEditingId(null);
    }
  };

  // Lọc nhà xuất bản theo từ khóa tìm kiếm
  const filteredPublishers = publishers.filter(publisher => 
    publisher.publisher_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Quản Lý Nhà Xuất Bản</h1>
      
      {/* Phần tìm kiếm */}
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm nhà xuất bản..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Phần thêm nhà xuất bản mới */}
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
                <tr key={publisher.publisher_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{publisher.publisher_id}</td>
                  <td className="p-3">
                    {editingId === publisher.publisher_id ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      publisher.publisher_name
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    {editingId === publisher.publisher_id ? (
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
                      onClick={() => handleDeletePublisher(publisher.publisher_id)}
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