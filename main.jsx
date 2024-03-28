import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './app/store'
import { Provider } from 'react-redux'
import { MyContextProvider } from './context/context.jsx'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { BrowserRouter, HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(

  <MyContextProvider>
  <Provider store={store}>
    <HashRouter>
    <App />
    </HashRouter>
  </Provider>
  </MyContextProvider>
)
