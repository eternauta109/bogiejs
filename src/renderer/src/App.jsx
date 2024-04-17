import { Route, Routes, useNavigate } from 'react-router-dom'
import NavBar from './features/NavBar'

/* import Kanban from './features/kanban_board/Kanban' */
import Topics from './features/topics/Topics'
import ShareCalendar from './features/calendar/ShareCalendar'
import Login from './features/Login'
import useEventsStore from './store/EventDataContext'
import Dashboard from './features/dashboard/Dashboard'

function App() {
  const { user } = useEventsStore()

  return (
    <>
      <div className="App">
        {user?.user.isAuth ? <NavBar /> : null}
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/calendar" element={<ShareCalendar />} />
          <Route path="/topics" element={<Topics />} />
          {/* <Route path="/kanban" element={<Kanban />} /> */}
          {user?.user.role === 'tm' ? <Route path="/dashboard" element={<Dashboard />} /> : null}
        </Routes>
      </div>
    </>
  )
}

export default App
