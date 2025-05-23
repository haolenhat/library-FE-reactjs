import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCartPlus, faFile, faClock, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [categories, setCategories] = useState(["Tất cả"]);
    const [activeCategory, setActiveCategory] = useState("Tất cả");
    const [borrowedCount, setBorrowedCount] = useState(0);
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [booksBorrowCount, setBooksBorrowCount] = useState([]);
    const navigate = useNavigate();
    const [borrowerInfo, setBorrowerInfo] = useState({
        borrowerCode: "",
        borrowerName: "",
        returnDate: new Date().toISOString().slice(0, 10),
        lostOrDamagedFee: 0.00
    });

    useEffect(() => {
        // Fetch books data
        axios
            .get("http://localhost:8080/api/books/all")
            .then((res) => {
                const data = res.data;
                setBooks(data);
                setFilteredBooks(data);
                const uniqueCategories = [...new Set(data.map((book) => book.category?.categoryName).filter(Boolean))];
                setCategories(["Tất cả", ...uniqueCategories]);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy dữ liệu sách:", err);
            });

        // Fetch book borrow count data
        fetchBorrowCountData();
    }, []);

    // Function to fetch book borrow count data
    const fetchBorrowCountData = () => {
        axios
            .get("http://localhost:8080/api/books/count")
            .then((res) => {
                setBooksBorrowCount(res.data);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy dữ liệu số lượng mượn sách:", err);
            });
    };

    // Function to get borrowed copies for a book
    const getBorrowedCopies = (bookId) => {
        const bookBorrowInfo = booksBorrowCount.find(item => item.bookId === bookId);
        return bookBorrowInfo ? bookBorrowInfo.borrowedCopies : 0;
    };

    // Function to calculate actual available copies
    const getActualAvailableCopies = (book) => {
        const borrowedCopies = getBorrowedCopies(book.bookId);
        const availableCopies = book.availableCopies - borrowedCopies;
        // Trả về 0 nếu số lượng sách khả dụng là số âm
        return availableCopies > 0 ? availableCopies : 0;
    };

    // Function to check if a book is available for borrowing
    const isBookAvailable = (book) => {
        const borrowedCopies = getBorrowedCopies(book.bookId);
        return book.availableCopies - borrowedCopies > 0;
    };

    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName);
        setFilteredBooks(
            categoryName === "Tất cả"
                ? books
                : books.filter((book) => book.category?.categoryName === categoryName)
        );
    };

    const handleBorrowClick = (book) => {
        const existingBookIndex = cart.findIndex((item) => item.id === book.bookId);
        if (existingBookIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[existingBookIndex].quantity += 1;
            setCart(updatedCart);
        } else {
            setCart([...cart, { id: book.bookId, title: book.title, quantity: 1 }]);
        }
        setBorrowedCount((prev) => prev + 1);
    };

    const handleCartToggle = () => {
        setIsCartVisible(!isCartVisible);
    };

    const handleCartClose = () => {
        setIsCartVisible(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedReturnDate = borrowerInfo.returnDate + "T00:00:00";
            const librarian = JSON.parse(localStorage.getItem("user"));
            const requestData = {
                borrowerCode: borrowerInfo.borrowerCode,
                borrowerName: borrowerInfo.borrowerName,
                returnDate: formattedReturnDate,
                librarianId: librarian?.userId,
                status: "Borrowed", // Đặt status mặc định là Borrowed
                lostOrDamagedFee: borrowerInfo.lostOrDamagedFee, // Lấy giá trị từ người dùng nhập
                loanCards: cart.map((item) => ({ bookId: item.id, quantity: item.quantity }))
            };
            const response = await axios.post("http://localhost:8080/api/loan-records/add", requestData);
            alert("Yêu cầu mượn sách thành công!");
            setCart([]);
            setBorrowedCount(0);
            setBorrowerInfo({
                borrowerCode: "",
                borrowerName: "",
                returnDate: new Date().toISOString().slice(0, 10),
                lostOrDamagedFee: 0.00
            });
            setIsCartVisible(false);
            // Refresh borrow count data after successful submission
            fetchBorrowCountData();
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu mượn sách:", error);
            alert("Sách mượn vượt quá số lượng cho phép.");
        }
    };

    const handleRemoveFromCart = (bookId) => {
        const updatedCart = cart.filter((item) => item.id !== bookId);
        setCart(updatedCart);
        setBorrowedCount(updatedCart.reduce((count, item) => count + item.quantity, 0));
    };

    // Navigation functions
    const handleAuthorManagement = () => {
        navigate("/ManageAuthors"); // Chuyển hướng đến trang quản lý tác giả
    };

    const handlePublisherManagement = () => {
        navigate("/ManagePublishers"); // Chuyển hướng đến trang quản lý nhà xuất bản
    };

    const handleCategoryManagement = () => {
        navigate("/ManageCategory"); // Chuyển hướng đến trang quản lý loại sách
    };

    const handleBookManagement = () => {
        navigate("/ManageBook"); // Chuyển hướng đến trang quản lý thông tin sách
    };
    
    const handleUserManagement = () => {
        navigate("/ManageEmployeesInfos"); // Chuyển hướng đến trang quản lý thông tin người dùng
    };

        
    const handleUserBorrower = () => {
        navigate("/ManageBorrower"); // Chuyển hướng đến trang quản lý thông tin người dùng
    };

    const handleLogout = () => {
        localStorage.removeItem("user"); // Xóa dữ liệu đăng nhập
        navigate("/"); // Chuyển hướng về trang đăng nhập
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-1/5 bg-teal-500 text-white min-h-screen">
                <div className="p-4 text-lg font-bold">QUẢN LÍ THƯ VIỆN Nhóm 3</div>
                <ul className="space-y-2">
                    <li className="p-2 hover:bg-teal-600 cursor-pointer" onClick={handleAuthorManagement}>Quản lý Tác giả</li>
                    <li className="p-2 hover:bg-teal-600 cursor-pointer" onClick={handlePublisherManagement}>Quản lý Nhà Xuất Bản</li>
                    <li className="p-2 hover:bg-teal-600 cursor-pointer" onClick={handleCategoryManagement}>Quản lý Loại Sách</li>
                    <li className="p-2 hover:bg-teal-600 cursor-pointer" onClick={handleBookManagement}>Quản Thông Tin Sách</li>
                    <li className="p-2 hover:bg-teal-600 cursor-pointer" onClick={handleUserBorrower}>Quản Thông Tin Người mượn sách</li>
                    <li className="p-2 hover:bg-teal-600 cursor-pointer" onClick={handleUserManagement}>Quản lý Người Dùng</li>
                    <li className="p-2 hover:bg-teal-600 cursor-pointer mt-8 text-red-200" onClick={handleLogout}>
                        Đăng xuất
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-4/5">
                <div className="max-w-6xl mx-auto mt-8 px-4">
                    <div className="flex justify-between items-centerit  mb-4 relative">
                        <h1 className="text-2xl font-bold flex items-center">
                            <FontAwesomeIcon icon={faBook} className="text-red-500 mr-2" />
                            Tổng hợp sách trong thư viện
                        </h1>
                        <Link to="/borrow" className="cursor-pointer hover:opacity-80 flex items-center">
                            <FontAwesomeIcon className="mr-[10px] text-blue-500" icon={faFile} />
                            Quản lí phiếu mượn/trả
                        </Link>
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faCartPlus}
                                className="text-green-500 text-xl cursor-pointer"
                                onClick={handleCartToggle}
                            />
                            {borrowedCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                    {borrowedCount}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg">
                        <div className="flex border-b overflow-x-auto">
                            {categories.map((category, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`flex-1 text-center py-2 whitespace-nowrap px-2 ${activeCategory === category
                                        ? "border-b-2 border-red-500 text-red-500 font-semibold"
                                        : "text-gray-600 hover:text-red-500"}`}
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
                                                Còn lại: {getActualAvailableCopies(book)} cuốn 
                                                {getBorrowedCopies(book.bookId) > 0 && (
                                                    <span className="ml-2 text-blue-500">
                                                        (Đã mượn: {getBorrowedCopies(book.bookId)} cuốn)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            {isBookAvailable(book) && (
                                                <button
                                                    onClick={() => handleBorrowClick(book)}
                                                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded focus:outline-none"
                                                >
                                                    Cho mượn
                                                </button>
                                            )}
                                            {!isBookAvailable(book) && (
                                                <span className="text-red-500 text-sm font-medium">
                                                    Hết sách
                                                </span>
                                            )}
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

            {isCartVisible && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Danh sách sách đã chọn</h2>
                        <ul>
                            {cart.map((item) => (
                                <li key={item.id} className="flex justify-between mb-4">
                                    <span>{item.title}</span>
                                    <span>Số lượng: {item.quantity}</span>
                                    <button
                                        onClick={() => handleRemoveFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Xóa
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <input
                            type="text"
                            placeholder="Mã người mượn"
                            value={borrowerInfo.borrowerCode}
                            onChange={(e) => setBorrowerInfo({ ...borrowerInfo, borrowerCode: e.target.value })}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Tên người mượn"
                            value={borrowerInfo.borrowerName}
                            onChange={(e) => setBorrowerInfo({ ...borrowerInfo, borrowerName: e.target.value })}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <input
                            type="date"
                            value={borrowerInfo.returnDate}
                            onChange={(e) => setBorrowerInfo({ ...borrowerInfo, returnDate: e.target.value })}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Tiền thiệt hại mất sách"
                            value={borrowerInfo.lostOrDamagedFee}
                            onChange={(e) => setBorrowerInfo({ ...borrowerInfo, lostOrDamagedFee: parseFloat(e.target.value) })}
                            className="w-full p-2 border rounded mb-4"
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={handleCartClose}
                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 focus:outline-none"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleFormSubmit}
                                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 focus:outline-none"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;