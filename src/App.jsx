import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { trackPageView } from './utils/analytics.js'

const Home = lazy(() => import('./pages/Home.jsx'))
const Browse = lazy(() => import('./pages/Browse.jsx'))
const Search = lazy(() => import('./pages/Search.jsx'))
const Genre = lazy(() => import('./pages/Genre.jsx'))
const Top = lazy(() => import('./pages/Top.jsx'))
const AnimeDetail = lazy(() => import('./pages/AnimeDetail.jsx'))
const Watch = lazy(() => import('./pages/Watch.jsx'))

function Spinner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', gap: '12px', color: 'var(--text-muted)'
    }}>
      <div style={{
        width: 36, height: 36, border: '3px solid var(--bg-surface)',
        borderTopColor: 'var(--accent-fire)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      Loading...
    </div>
  )
}

// Tracks every route change as a GA4 page_view
function AnalyticsTracker() {
  const location = useLocation()
  useEffect(() => {
    trackPageView(location.pathname + location.search)
  }, [location])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <Navbar />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/search" element={<Search />} />
          <Route path="/genre/:genre" element={<Genre />} />
          <Route path="/top" element={<Top />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="*" element={
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', minHeight: '80vh', gap: '16px',
              color: 'var(--text-muted)'
            }}>
              <span style={{fontSize: 72}}>🎌</span>
              <h2 style={{fontSize: 24, color: 'var(--text-primary)'}}>404 — Page Not Found</h2>
              <a href="/" style={{color: 'var(--accent-fire)'}}>Go Home →</a>
            </div>
          } />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  )
}
