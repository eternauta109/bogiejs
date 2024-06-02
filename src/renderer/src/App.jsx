import { Route, Routes, Navigate } from 'react-router-dom'
import NavBar from './features/NavBar'
import Lavagna from './features/kanban_board/Lavagna'
import Topics from './features/topics/Topics'
import ShareCalendar from './features/calendar/ShareCalendar'
import Login from './features/Login'
import useEventsStore from './store/EventDataContext'
import Dashboard from './features/dashboard/Dashboard'

function App() {
  const { user } = useEventsStore()

  return (
    <div className="App">
      {user?.user.isAuth && <NavBar />}
      <Routes>
        <Route path="/" element={user?.user.isAuth ? <Navigate to="/calendar" /> : <Login />} />
        <Route
          path="/calendar"
          element={user?.user.isAuth ? <ShareCalendar /> : <Navigate to="/" />}
        />
        <Route path="/topics" element={user?.user.isAuth ? <Topics /> : <Navigate to="/" />} />
        <Route path="/kanban" element={user?.user.isAuth ? <Lavagna /> : <Navigate to="/" />} />
        <Route
          path="/dashboard"
          element={
            user?.user.isAuth && user.user.role === 'tm' ? <Dashboard /> : <Navigate to="/" />
          }
        />
      </Routes>
    </div>
  )
}

export default App
