import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageBorrowers = () => {
    const [authors, setAuthors] = useState([]);
    const [newAuthor, setNewAuthor] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");

    // Lấy danh sách tác giả từ backend
    const fetchAuthors = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/borrowers/all');
            setAuthors(res.data);
        } catch (error) {
            console.error("Lỗi khi tải tác giả:", error);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const generateRandomCode = (length = 10) => { 
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }

    // Thêm tác giả mới
    const handleAddAuthor = async () => {
        if (newAuthor.trim() !== "") {
            try {
                console.log(newAuthor);
                const res = await axios.post('http://localhost:8080/api/borrowers/add', {
                    borrowerCode: generateRandomCode(),
                    fullName: newAuthor
                });
                setAuthors([...authors, res.data]);
                setNewAuthor("");
            } catch (error) {
                console.error("Lỗi khi thêm tác giả:", error);
                alert("Thêm thất bại");
            }
        }
    };

    // Xóa tác giả
    const handleDeleteAuthor = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/borrowers/delete/${id}`);
            setAuthors(authors.filter(author => author.authorId !== id));
        } catch (error) {
            console.error("Lỗi khi xóa tác giả:", error);
            alert("Xóa thất bại");
        }
    };

    // Bắt đầu chỉnh sửa
    const startEditing = (author) => {
        setEditingId(author.borrowerCode);
        setEditValue(author.fullName);
    };

    // Lưu chỉnh sửa
    const saveEdit = async () => {
        if (editValue.trim() !== "") {
            try {
                const res = await axios.put(`http://localhost:8080/api/borrowers/edit/${editingId}`, {
                    fullName: editValue
                });
                setAuthors(authors.map(author =>
                    author.borrowerCode === editingId ? res.data : author
                ));
                setEditingId(null);
                setEditValue("");
            } catch (error) {
                console.error("Lỗi khi cập nhật tác giả:", error);
                alert("Cập nhật thất bại");
            }
        }
    };

    // Lọc tác giả theo từ khóa tìm kiếm
    const filteredAuthors = authors.filter(author =>
        author.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Quản Lý khách hàng</h1>

            {/* Tìm kiếm */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng..."
                    className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Thêm tác giả */}
            <div className="mb-6 bg-blue-50 p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-3 text-blue-700">Thêm Khách Hàng Mới</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Nhập tên khách hàng mới..."
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
                    Danh Sách Khách Hàng ({filteredAuthors.length})
                </h2>

                {filteredAuthors.length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3 font-semibold w-16">ID</th>
                                <th className="p-3 font-semibold">Tên Khách Hàng</th>
                                <th className="p-3 font-semibold w-32 text-center">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAuthors.map(author => (
                                <tr key={author.borrowerCode} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{author.borrowerCode}</td>
                                    <td className="p-3">
                                        {editingId === author.borrowerCode ? (
                                            <input
                                                type="text"
                                                className="p-1 border rounded w-full"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                            />
                                        ) : (
                                            author.fullName
                                        )}
                                    </td>
                                    <td className="p-3 flex justify-center gap-2">
                                        {editingId === author.borrowerCode ? (
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
                                            onClick={() => handleDeleteAuthor(author.borrowerCode)}
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

export default ManageBorrowers;