import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PageNotFound from '@/pages/PageNotFound'
import ScrollToTop from '@/components/ScrollToTop'
import Home from '@/pages/Home'

const CrimsonDomain = lazy(() => import('@/pages/CrimsonDomain'))

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crimson-domain" element={<Suspense fallback={<div className="min-h-screen bg-[#0b0b0f]" />}><CrimsonDomain /></Suspense>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  )
}

export default App
