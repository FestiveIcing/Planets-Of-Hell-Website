import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { initDevToolsGuard } from '@/lib/devtoolsGuard'

initDevToolsGuard()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
