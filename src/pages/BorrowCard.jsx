import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const BorrowCard = () => {
    const [loanRecords, setLoanRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");

    const statuses = {
        Borrowed: "Phiếu mượn",
        Returned: "Phiếu trả",
        Lost: "Mất sách",
        OverDue: "Quá hạn",
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/loan-records/all")
            .then((res) => res.json())
            .then((data) => {
                setLoanRecords(data);
                setFilteredRecords(data);
            })
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        if (status === "all") {
            setFilteredRecords(loanRecords);
        } else {
            const filtered = loanRecords.filter((record) => record.status === status);
            setFilteredRecords(filtered);
        }
    };

    const handleStatusUpdate = async (loanId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/api/loan-records/edit/${loanId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Cập nhật trạng thái trong loanRecords và filteredRecords
                const updatedRecords = loanRecords.map((record) =>
                    record.loanId === loanId ? { ...record, status: newStatus } : record
                );
                setLoanRecords(updatedRecords);  // Cập nhật loanRecords
                setFilteredRecords(updatedRecords.filter(record =>
                    selectedStatus === "all" || record.status === selectedStatus
                ));  // Cập nhật filteredRecords theo status hiện tại
            } else {
                alert("Cập nhật trạng thái thất bại.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Lỗi khi gửi yêu cầu cập nhật.");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Link to="/home" className="flex items-center gap-2 text-blue-600 hover:underline">
                <FontAwesomeIcon icon={faHouse} />
                <span>Trang chủ</span>
            </Link>

            <h1 className="text-2xl font-semibold mb-6">Danh sách phiếu mượn</h1>

            {/* Tabs */}
            <div className="mb-4">
                {["all", ...Object.keys(statuses)].map((status) => (
                    <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`px-4 py-2 rounded-md mr-2 ${selectedStatus === status ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        {status === "all" ? "Tất cả" : statuses[status]}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left">
                            <th className="p-3 border">Mã mượn</th>
                            <th className="p-3 border">Mã người mượn</th>
                            <th className="p-3 border">Tên người mượn</th>
                            <th className="p-3 border">Thủ thư</th>
                            <th className="p-3 border">Ngày mượn</th>
                            <th className="p-3 border">Ngày trả</th>
                            <th className="p-3 border">Trạng thái</th>
                            <th className="p-3 border">Phí mất/hư</th>
                            <th className="p-3 border">Chi tiết sách</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center p-4 text-gray-500">
                                    Không có phiếu mượn nào.
                                </td>
                            </tr>
                        )}
                        {filteredRecords.map((record) => (
                            <tr key={record.loanId} className="border-t">
                                <td className="p-3 border">{record.loanId}</td>
                                <td className="p-3 border">{record.borrowerCode || "—"}</td>
                                <td className="p-3 border">{record.borrowerName || "—"}</td>
                                <td className="p-3 border">{record.librarianName || "—"}</td>
                                <td className="p-3 border">
                                    {record.borrowDate
                                        ? new Date(record.borrowDate).toLocaleDateString()
                                        : "—"}
                                </td>
                                <td className="p-3 border">
                                    {record.returnDate
                                        ? new Date(record.returnDate).toLocaleDateString()
                                        : "—"}
                                </td>
                                <td className="p-3 border">
                                    <select
                                        value={record.status}
                                        onChange={(e) =>
                                            handleStatusUpdate(record.loanId, e.target.value)
                                        }
                                        className={`px-2 py-1 rounded-md w-full font-semibold ${record.status === "Borrowed"
                                            ? "text-blue-600 bg-blue-100"
                                            : record.status === "Returned"
                                                ? "text-green-600 bg-green-100"
                                                : record.status === "Lost"
                                                    ? "text-yellow-700 bg-yellow-100"
                                                    : record.status === "OverDue"
                                                        ? "text-red-600 bg-red-100"
                                                        : "text-gray-500 bg-gray-100"
                                            }`}
                                    >
                                        {Object.keys(statuses).map((status) => (
                                            <option key={status} value={status}>
                                                {statuses[status]}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-3 border">
                                    {record.lostOrDamagedFee != null
                                        ? `${record.lostOrDamagedFee.toLocaleString()} đ`
                                        : "0 đ"}
                                </td>
                                <td className="p-3 border">
                                    <table className="min-w-full text-sm border border-gray-200">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-600">
                                                <th className="p-2 border">Mã sách</th>
                                                <th className="p-2 border">Tên sách</th>
                                                <th className="p-2 border">Số lượng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(record.loanCards) &&
                                                record.loanCards.length > 0 ? (
                                                record.loanCards.map((card) => (
                                                    <tr key={card.loancardId}>
                                                        <td className="p-2 border">{card.bookId}</td>
                                                        <td className="p-2 border">{card.bookTitle}</td>
                                                        <td className="p-2 border text-center">{card.quantity}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center p-2 text-gray-400">
                                                        Không có sách
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BorrowCard;

