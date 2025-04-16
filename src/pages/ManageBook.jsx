import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    linkImg: "",
    availableCopies: 0,
    description: "",
    publisherName: "",
    categoryName: "",
    authorNames: []
  });

  // Lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      const booksRes = await axios.get('http://localhost:8080/api/books/all');
      const authorsRes = await axios.get('http://localhost:8080/api/authors/all');
      const categoriesRes = await axios.get('http://localhost:8080/api/categories/all');
      const publishersRes = await axios.get('http://localhost:8080/api/publishers/all');
      
      setBooks(booksRes.data);
      setAuthors(authorsRes.data);
      setCategories(categoriesRes.data);
      setPublishers(publishersRes.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Xử lý chọn tác giả (nhiều)
  const handleAuthorChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData({
      ...formData,
      authorNames: selectedValues
    });
  };

  // Xử lý thêm sách mới
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/books/add', formData);
      fetchData(); // Tải lại dữ liệu sau khi thêm
      resetForm();
      setIsAdding(false);
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error);
      alert("Thêm sách thất bại!");
    }
  };

  // Xử lý chỉnh sửa sách
  const handleEditBook = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/books/edit/${selectedBook.bookId}`, formData);
      fetchData(); // Tải lại dữ liệu sau khi sửa
      resetForm();
      setIsEditing(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật sách:", error);
      alert("Cập nhật sách thất bại!");
    }
  };

  // Xử lý xóa sách
  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
      try {
        await axios.delete(`http://localhost:8080/api/books/delete/${bookId}`);
        setBooks(books.filter(book => book.bookId !== bookId));
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
        alert("Xóa sách thất bại!");
      }
    }
  };

  // Bắt đầu chỉnh sửa sách - Đã sửa để xử lý khi category là null
  const startEditing = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title || "",
      linkImg: book.linkImg || "",
      availableCopies: book.availableCopies || 0,
      description: book.description || "",
      publisherName: book.publisher?.publisherName || "",
      
      // Xử lý khi category là null
      categoryName: book.category?.categoryName || "",
      authorNames: book.authors?.map(author => author.authorName) || []
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      linkImg: "",
      availableCopies: 0,
      description: "",
      publisherName: "",
      categoryName: "",
      authorNames: []
    });
  };

  // Lọc sách theo từ khóa tìm kiếm
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (book.authors && book.authors.some(author => author.authorName.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    (book.publisher && book.publisher.publisherName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (book.category && book.category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Quản Lý Sách</h1>

      {/* Tìm kiếm */}
      <div className="mb-6 flex">
        <input
          type="text"
          placeholder="Tìm kiếm sách..."
          className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            setIsEditing(false);
            resetForm();
          }}
          className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          {isAdding ? "Đóng" : "Thêm Sách Mới"}
        </button>
      </div>

      {/* Form thêm/sửa sách */}
      {(isAdding || isEditing) && (
        <div className="mb-8 bg-blue-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            {isAdding ? "Thêm Sách Mới" : "Chỉnh Sửa Sách"}
          </h2>
          <form onSubmit={isAdding ? handleAddBook : handleEditBook}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Tên Sách</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Link Hình Ảnh</label>
                <input
                  type="text"
                  name="linkImg"
                  value={formData.linkImg}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Số Lượng</label>
                <input
                  type="number"
                  name="availableCopies"
                  value={formData.availableCopies}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Loại Sách</label>
                <select
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  required
                >
                  <option value="">-- Chọn Loại Sách --</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Nhà Xuất Bản</label>
                <select
                  name="publisherName"
                  value={formData.publisherName}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  required
                >
                  <option value="">-- Chọn Nhà Xuất Bản --</option>
                  {publishers.map(publisher => (
                    <option key={publisher.publisherId} value={publisher.publisherName}>
                      {publisher.publisherName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Tác Giả (giữ Ctrl để chọn nhiều)</label>
                <select
                  name="authorNames"
                  multiple
                  value={formData.authorNames}
                  onChange={handleAuthorChange}
                  className="p-2 border rounded w-full h-32"
                  required
                >
                  {authors.map(author => (
                    <option key={author.authorId} value={author.authorName}>
                      {author.authorName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Mô Tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="p-2 border rounded w-full h-32"
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(false);
                  resetForm();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {isAdding ? "Thêm" : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách sách */}
      <div className="bg-white rounded shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">
          Danh Sách Sách ({filteredBooks.length})
        </h2>

        {filteredBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 font-semibold">Hình Ảnh</th>
                  <th className="p-3 font-semibold">Tên Sách</th>
                  <th className="p-3 font-semibold">Tác Giả</th>
                  <th className="p-3 font-semibold">Loại Sách</th>
                  <th className="p-3 font-semibold">NXB</th>
                  <th className="p-3 font-semibold">Số Lượng</th>
                  <th className="p-3 font-semibold w-24 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.bookId} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <img 
                        src={book.linkImg} 
                        alt={book.title} 
                        className="w-16 h-20 object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/100x150?text=No+Image";
                        }}
                      />
                    </td>
                    <td className="p-3 font-medium">{book.title}</td>
                    <td className="p-3">
                      {book.authors.map(author => author.authorName).join(", ")}
                    </td>
                    <td className="p-3">{book.category ? book.category.categoryName : "Chưa phân loại"}</td>
                    <td className="p-3">{book.publisher.publisherName}</td>
                    <td className="p-3">{book.availableCopies}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => startEditing(book)}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.bookId)}
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-6 text-center text-gray-500">Không tìm thấy sách nào</p>
        )}
      </div>
      
      {/* Chi tiết sách modal/section có thể thêm sau nếu cần */}
    </div>
  );
};

export default ManageBooks;