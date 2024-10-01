import { Route, Routes, Navigate } from 'react-router-dom'
import NavBar from './features/NavBar'

import Login from './features/Login'
import { useSelector } from 'react-redux'

import Landing from './features/home/Landing'
import ManageProducts from './features/Products/ManageProducts'
import Supplies from './features/Supplies/Supplies'
import ExcelLoader from './features/Loader/ExcelLoader'
import YumCart from './features/YumCart/YumCart'
import Dashboard from './features/dashboard/Dashboard'
import TransactionsAnalisys from './features/transactions/TransactionAnalisys'

function App() {
  const user = useSelector((state) => state.managers.user) // Assume che managerFound sia nello stato dei manager

  return (
    <div className="App">
      {user?.isAuth && <NavBar />}
      <Routes>
        <Route path="/" element={user?.isAuth ? <Navigate to="/landing" /> : <Login />} />
        <Route path="/landing" element={user?.isAuth ? <Landing /> : <Navigate to="/" />} />
        <Route
          path="/manage-products"
          element={user?.isAuth ? <ManageProducts /> : <Navigate to="/" />}
        />
        <Route path="/supplies" element={user?.isAuth ? <Supplies /> : <Navigate to="/" />} />
        <Route path="/loader" element={user?.isAuth ? <ExcelLoader /> : <Navigate to="/" />} />
        <Route path="/yumcart" element={user?.isAuth ? <YumCart /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={user?.isAuth ? <Dashboard /> : <Navigate to="/" />} />
        <Route
          path="/transactionAnalisys"
          element={user?.isAuth ? <TransactionsAnalisys /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  )
}

export default App
