import React, { useState } from 'react';

const ManageAuthors = () => {
  // Dữ liệu mẫu cho tác giả
  const [authors, setAuthors] = useState([
    { author_id: 1, author_name: "Nguyễn Nhật Ánh" },
    { author_id: 2, author_name: "Tô Hoài" },
    { author_id: 3, author_name: "Nguyễn Tuân" },
    { author_id: 4, author_name: "Xuân Diệu" },
    { author_id: 5, author_name: "Hồ Xuân Hương" },
    { author_id: 6, author_name: "Vũ Trọng Phụng" },
    { author_id: 7, author_name: "Nam Cao" }
  ]);

  const [newAuthor, setNewAuthor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Hàm thêm tác giả mới (giả lập)
  const handleAddAuthor = () => {
    if (newAuthor.trim() !== "") {
      const newId = Math.max(...authors.map(a => a.author_id)) + 1;
      setAuthors([...authors, { author_id: newId, author_name: newAuthor }]);
      setNewAuthor("");
    }
  };

  // Hàm xóa tác giả (giả lập)
  const handleDeleteAuthor = (id) => {
    setAuthors(authors.filter(author => author.author_id !== id));
  };

  // Hàm bắt đầu chỉnh sửa
  const startEditing = (author) => {
    setEditingId(author.author_id);
    setEditValue(author.author_name);
  };

  // Hàm lưu chỉnh sửa
  const saveEdit = () => {
    if (editValue.trim() !== "") {
      setAuthors(authors.map(author => 
        author.author_id === editingId ? 
        { ...author, author_name: editValue } : author
      ));
      setEditingId(null);
    }
  };

  // Lọc tác giả theo từ khóa tìm kiếm
  const filteredAuthors = authors.filter(author => 
    author.author_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Quản Lý Tác Giả</h1>
      
      {/* Phần tìm kiếm */}
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm tác giả..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Phần thêm tác giả mới */}
      <div className="mb-6 bg-blue-50 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">Thêm Tác Giả Mới</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nhập tên tác giả mới..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
          <button
            onClick={handleAddAuthor}
className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Thêm
          </button>
        </div>
      </div>
      
      {/* Danh sách tác giả */}
      <div className="bg-white rounded shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">
          Danh Sách Tác Giả ({filteredAuthors.length})
        </h2>
        
        {filteredAuthors.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 font-semibold w-16">ID</th>
                <th className="p-3 font-semibold">Tên Tác Giả</th>
                <th className="p-3 font-semibold w-32 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuthors.map(author => (
                <tr key={author.author_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{author.author_id}</td>
                  <td className="p-3">
                    {editingId === author.author_id ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                        author.author_name
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    {editingId === author.author_id ? (
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Lưu
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(author)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Sửa
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAuthor(author.author_id)}
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
          <p className="p-4 text-center text-gray-500">Không tìm thấy tác giả nào</p>
        )}
      </div>
    </div>
  );
};

export default ManageAuthors;