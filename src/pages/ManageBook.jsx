import React, { useState } from 'react';

const ManageBook = () => {
  // Dữ liệu mẫu cho Thông Tin Sách
  const [books, setbooks] = useState([
    { book_id: 1, book_name: "Tết ở làng Địa Ngục", quantity: 10, borrow: 2, status: 'new', category: 'Kinh Dị', author: 'Nam Cao', publisher: 'NXB Kim Đồng' },
    { book_id: 2, book_name: "Ngôi nhà kỳ quái", quantity: 10, borrow: 2, status: 'new', category: 'Kinh Dị', author: 'Nam Cao', publisher: 'NXB Kim Đồng' },
    { book_id: 3, book_name: "Lớp có Tang sự không cần điểm danh", quantity: 10, borrow: 2, status: 'new', category: 'Kinh Dị', author: 'Nam Cao', publisher: 'NXB Kim Đồng' },
  ]);

  const [newbook, setNewbook] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Hàm thêm Thông Tin Sách mới (giả lập)
  const handleAddbook = () => {
    if (newbook.trim() !== "") {
      const newId = Math.max(...books.map(p => p.book_id)) + 1;
        setbooks([...books, { book_id: newId, book_name: newbook, quantity: quantity, borrow: 0, status: 'new', category: category, author: author, publisher: publisher}]);
      setNewbook("");
    }
  };

  // Hàm xóa Thông Tin Sách (giả lập)
  const handleDeletebook = (id) => {
    setbooks(books.filter(book => book.book_id !== id));
  };

  // Hàm bắt đầu chỉnh sửa
  const startEditing = (book) => {
    setEditingId(book.book_id);
    setEditValue(book.book_name);
  };

  // Hàm lưu chỉnh sửa
  const saveEdit = () => {
    if (editValue.trim() !== "") {
      setbooks(books.map(book => 
        book.book_id === editingId ? 
        { ...book, book_name: editValue } : book
      ));
      setEditingId(null);
    }
  };

  // Lọc Thông Tin Sách theo từ khóa tìm kiếm
  const filteredbooks = books.filter(book => 
    book.book_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Quản Lý Thông Tin Sách</h1>
      
      {/* Phần tìm kiếm */}
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm Thông Tin Sách..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Phần thêm Thông Tin Sách mới */}
      <div className="mb-6 bg-blue-50 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">Thêm Thông Tin Sách Mới</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            id="newbook"
            placeholder="Nhập tên Sách mới..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newbook}
            onChange={(e) => setNewbook(e.target.value)}
          />
          <input
            type="number"
            id="quantity"
            placeholder="Nhập số lượng Sách mới..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nhập loai Sách mới..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nhập tác giả mới..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nhập tên NXB Sách mới..."
            className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
          />
          <button
            onClick={handleAddbook}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Thêm
          </button>
        </div>
      </div>
      
      {/* Danh sách Thông Tin Sách */}
      <div className="bg-white rounded shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">
          Danh Sách Thông Tin Sách ({filteredbooks.length})
        </h2>
        
        {filteredbooks.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 font-semibold w-16">ID</th>
                <th className="p-3 font-semibold">Tên Sách</th>
                <th className="p-3 font-semibold">Số lượng</th>
                <th className="p-3 font-semibold">Tình trạng</th>
                <th className="p-3 font-semibold">Loại sách</th>
                <th className="p-3 font-semibold">Tác giả</th>
                <th className="p-3 font-semibold">NXB</th>
                <th className="p-3 font-semibold w-32 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredbooks.map(book => (
                <tr key={book.book_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{book.book_id}</td>
                  <td className="p-3">
                    {editingId === book.book_id ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      book.book_name
                    )}
                      </td>
                      <td className="p-3">
                    {editingId === book.book_id ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      book.quantity
                    )}
                      </td>
                      <td className="p-3">
                    {editingId === book.book_id ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={quantity}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      book.status
                    )}
                      </td>
                      <td className="p-3">
                    {editingId === book.book_id ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={borrow}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      book.category
                    )}
                      </td>
                      <td className="p-3">
                    {editingId === book.book_id ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      book.author
                    )}
                      </td>
                      <td className="p-3">
                    {editingId === book.book_id ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      book.publisher
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    {editingId === book.book_id ? (
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Lưu
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(book)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Sửa
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletebook(book.book_id)}
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
          <p className="p-4 text-center text-gray-500">Không tìm thấy Thông Tin Sách nào</p>
        )}
      </div>
    </div>
  );
};

export default ManageBook;