import './assets/main.css'

import ReactDOM from 'react-dom/client'
import App from './App'

import { HashRouter as Router } from 'react-router-dom'
import { EventStoreContext } from './store/EventDataContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  /*  <StrictMode> */
  <EventStoreContext>
    <Router>
      <App />
    </Router>
  </EventStoreContext>
  /*  </StrictMode> */
)
