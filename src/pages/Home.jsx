import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [categories, setCategories] = useState(["Tất cả"]);
    const [activeCategory, setActiveCategory] = useState("Tất cả");

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/books/all")
            .then((res) => {
                const data = res.data;
                setBooks(data);
                setFilteredBooks(data);

                // Lấy các category duy nhất từ dữ liệu sách
                const uniqueCategories = [
                    ...new Set(data.map((book) => book.category?.categoryName).filter(Boolean)),
                ];
                setCategories(["Tất cả", ...uniqueCategories]);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy dữ liệu sách:", err);
            });
    }, []);

    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName);
        if (categoryName === "Tất cả") {
            setFilteredBooks(books);
        } else {
            setFilteredBooks(
                books.filter((book) => book.category?.categoryName === categoryName)
            );
        }
    };

    return (
        <div className=" min-h-screen">
            <div className="max-w-6xl mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-4">Tổng hợp sách trong thư viện</h1>
                <div className="bg-white shadow-md rounded-lg">
                    <div className="flex border-b overflow-x-auto">
                        {categories.map((category, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleCategoryClick(category)}
                                className={`flex-1 text-center py-2 whitespace-nowrap px-2 ${activeCategory === category
                                    ? "border-b-2 border-red-500 text-red-500 font-semibold"
                                    : "text-gray-600 hover:text-red-500"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="p-4">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book, index) => (
                                <div key={book.bookId} className="flex items-center mb-6">
                                    <div className="w-16 text-center text-green-500 font-bold text-xl">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>
                                    <img
                                        src={book.linkImg}
                                        alt={book.title}
                                        className="w-16 h-24 object-cover mr-4"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold">{book.title}</div>
                                        <div className="text-gray-600">
                                            {book.authors.map((a) => a.authorName).join(", ")}
                                        </div>
                                        <div className="text-blue-500">
                                            {book.category?.categoryName} - {book.publisher?.publisherName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Còn lại: {book.availableCopies} cuốn
                                        </div>
                                    </div>

                                    {/* Nút "Cho mượn" nằm ở bên phải */}
                                    <div className="ml-4 flex-shrink-0">
                                        <button
                                            onClick={() => handleBorrowClick(book)}
                                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 focus:outline-none"
                                        >
                                            Cho mượn
                                        </button>
                                    </div>
                                </div>
                            ))


                        ) : (
                            <p className="text-center text-gray-500">Không có sách trong danh mục này.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
