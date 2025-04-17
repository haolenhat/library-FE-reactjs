import { useState } from 'react'
import './App.css'
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ManageAuthors from './pages/ManageAuthor'
import ManagePublishers from './pages/ManagePublisher'
import ManageCategory from './pages/ManageCategory'
import ManageBook from './pages/ManageBook'
import ManageEmployeesInfos from './pages/ManageEmployeesInfo'
import Registration from './pages/Register'
import Home from './pages/Home'
import BorrowCard from './pages/BorrowCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/borrow" element={<BorrowCard />} />
      <Route path="/ManageAuthors" element={<ManageAuthors />} />
      <Route path="/ManageBook" element={<ManageBook />} />
      <Route path="/ManageCategory" element={<ManageCategory />} />
      <Route path="/ManagePublishers" element={<ManagePublishers />} />
      <Route path="/ManageEmployeesInfos" element={<ManageEmployeesInfos />} />
      <Route path="/Registration" element={<Registration />} />
    </Routes>
  )
}

export default App
