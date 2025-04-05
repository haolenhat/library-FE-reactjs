import React, { useState } from 'react';

const ManageCategory = () => {
  // Dữ liệu mẫu cho Loại Sách
  const [categorys, setcategorys] = useState([
    { category_id: 1, category_name: "Trinh Thám" },
    { category_id: 2, category_name: "Kinh Dị" },
    { category_id: 3, category_name: "Cười" },
    { category_id: 4, category_name: "Hành Động" },
    { category_id: 5, category_name: "Giáo Khoa" },
    { category_id: 6, category_name: "Giải" },
  ]);

  const [newcategory, setNewcategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Hàm thêm Loại Sách mới (giả lập)
  const handleAddcategory = () => {
    if (newcategory.trim() !== "") {
      const newId = Math.max(...categorys.map(p => p.category_id)) + 1;
      setcategorys([...categorys, { category_id: newId, category_name: newcategory }]);
      setNewcategory("");
    }
  };

  // Hàm xóa Loại Sách (giả lập)
  const handleDeletecategory = (id) => {
    setcategorys(categorys.filter(category => category.category_id !== id));
  };

  // Hàm bắt đầu chỉnh sửa
  const startEditing = (category) => {
    setEditingId(category.category_id);
    setEditValue(category.category_name);
  };

  // Hàm lưu chỉnh sửa
  const saveEdit = () => {
    if (editValue.trim() !== "") {
      setcategorys(categorys.map(category => 
        category.category_id === editingId ? 
        { ...category, category_name: editValue } : category
      ));
      setEditingId(null);
    }
  };

  // Lọc Loại Sách theo từ khóa tìm kiếm
  const filteredcategorys = categorys.filter(category => 
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Quản Lý Loại Sách</h1>
      
      {/* Phần tìm kiếm */}
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm Loại Sách..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Phần thêm Loại Sách mới */}
      <div className="mb-6 bg-blue-50 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">Thêm Nhà Loại Sách Mới</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nhập tên Loại Sách mới..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newcategory}
            onChange={(e) => setNewcategory(e.target.value)}
          />
          <button
            onClick={handleAddcategory}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Thêm
          </button>
        </div>
      </div>
      
      {/* Danh sách Loại Sách */}
      <div className="bg-white rounded shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">
          Danh Sách Loại Sách ({filteredcategorys.length})
        </h2>
        
        {filteredcategorys.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 font-semibold w-16">ID</th>
                <th className="p-3 font-semibold">Tên Loại Sách</th>
                <th className="p-3 font-semibold w-32 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredcategorys.map(category => (
                <tr key={category.category_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{category.category_id}</td>
                  <td className="p-3">
                    {editingId === category.category_id ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      category.category_name
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    {editingId === category.category_id ? (
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Lưu
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(category)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Sửa
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletecategory(category.category_id)}
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
          <p className="p-4 text-center text-gray-500">Không tìm thấy Loại Sách nào</p>
        )}
      </div>
    </div>
  );
};

export default ManageCategory;