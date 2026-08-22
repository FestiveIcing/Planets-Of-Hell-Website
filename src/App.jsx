import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PageNotFound from '@/pages/PageNotFound'
import ScrollToTop from '@/components/ScrollToTop'
import Home from '@/pages/Home'
import CrimsonDomain from '@/pages/CrimsonDomain'

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crimson-domain" element={<CrimsonDomain />} />
        <Route path="/ghostly-manors" element={<GhostlyManors />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  )
}

export default App
