import './assets/main.css'

import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import { HashRouter as Router } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  /*  <StrictMode> */
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  /*  </StrictMode> */
)
