import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Lấy danh mục sách từ API
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories/all');
      setCategories(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục sách:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Thêm danh mục sách mới
  const handleAddCategory = async () => {
    if (newCategory.trim() !== "") {
      try {
        const res = await axios.post('/api/categories/add', {
          categoryName: newCategory
        });
        setCategories([...categories, res.data]);
        setNewCategory("");
      } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        alert("Thêm thất bại!");
      }
    }
  };

  // Xoá danh mục sách
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/delete/${id}`);
      setCategories(categories.filter(c => c.categoryId !== id));
    } catch (error) {
      console.error("Lỗi khi xoá danh mục:", error);
      alert("Xoá thất bại!");
    }
  };

  // Bắt đầu chỉnh sửa
  const startEditing = (category) => {
    setEditingId(category.categoryId);
    setEditValue(category.categoryName);
  };

  // Lưu chỉnh sửa danh mục
  const saveEdit = async () => {
    if (editValue.trim() !== "") {
      try {
        const res = await axios.put(`/api/categories/edit/${editingId}`, {
          categoryName: editValue
        });
        setCategories(categories.map(c =>
          c.categoryId === editingId ? res.data : c
        ));
        setEditingId(null);
        setEditValue("");
      } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        alert("Cập nhật thất bại!");
      }
    }
  };

  const filteredCategories = categories.filter(c =>
    c.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Quản Lý Loại Sách</h1>

      {/* Tìm kiếm */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm loại sách..."
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Thêm loại sách */}
      <div className="mb-6 bg-blue-50 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">Thêm Loại Sách Mới</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nhập tên loại sách mới..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Thêm
          </button>
        </div>
      </div>

      {/* Danh sách loại sách */}
      <div className="bg-white rounded shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">
          Danh Sách Loại Sách ({filteredCategories.length})
        </h2>

        {filteredCategories.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 font-semibold w-16">ID</th>
                <th className="p-3 font-semibold">Tên Loại Sách</th>
                <th className="p-3 font-semibold w-32 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(category => (
                <tr key={category.categoryId} className="border-t hover:bg-gray-50">
                  <td className="p-3">{category.categoryId}</td>
                  <td className="p-3">
                    {editingId === category.categoryId ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      category.categoryName
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    {editingId === category.categoryId ? (
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
                      onClick={() => handleDeleteCategory(category.categoryId)}
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
          <p className="p-4 text-center text-gray-500">Không tìm thấy loại sách nào</p>
        )}
      </div>
    </div>
  );
};

export default ManageCategory;