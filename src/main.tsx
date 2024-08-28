import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
//import axios from 'axios'

/*axios.get('').then(response => {
  const materials = response.data
  console.log(materials)
})
*/
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
