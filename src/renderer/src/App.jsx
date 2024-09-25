import { Route, Routes, Navigate } from 'react-router-dom'
import NavBar from './features/NavBar'
/* import Lavagna from './features/kanban_board/Lavagna'
import Topics from './features/topics/Topics'
import ShareCalendar from './features/calendar/ShareCalendar' */
import Login from './features/Login'
import { useSelector } from 'react-redux'
/* import Dashboard from './features/dashboard/Dashboard' */
import Landing from './features/home/Landing'
import ManageProducts from './features/Products/ManageProducts'

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
        {/*  <Route path="/calendar" element={user?.isAuth ? <ShareCalendar /> : <Navigate to="/" />} />
       
        <Route path="/topics" element={user?.isAuth ? <Topics /> : <Navigate to="/" />} />
        <Route path="/kanban" element={user?.isAuth ? <Lavagna /> : <Navigate to="/" />} />
        <Route
          path="/dashboard"
          element={user?.isAuth && user.role === 'tm' ? <Dashboard /> : <Navigate to="/" />}
        /> */}
      </Routes>
    </div>
  )
}

export default App
