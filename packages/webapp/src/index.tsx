import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalContexts } from './contexts/Global'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { MNRouter } from './routes/MNRouter'

ReactDOM.render(
  <React.StrictMode>
    <GlobalContexts>
      <MNRouter />
    </GlobalContexts>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
