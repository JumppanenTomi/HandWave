import React from 'react'
import ReactDOM from 'react-dom/client'
import './samples/node-api'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppAlternative from './AppAlternative'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppAlternative />
  </React.StrictMode>,
)

