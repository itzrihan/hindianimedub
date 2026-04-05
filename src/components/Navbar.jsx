import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../utils/api.js'
import styles from './Navbar.module.css'

const GENRES = [
  'action', 'adventure', 'comedy', 'drama', 'fantasy',
  'horror', 'mystery', 'romance', 'sci-fi', 'slice-of-life',
  'sports', 'supernatural', 'thriller'
]

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [liveResults, setLiveResults] = useState([])
  const [liveLoading, setLiveLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const debouncedQuery = useDebounce(searchQuery, 350)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setShowDropdown(false)
    setSearchQuery('')
    setLiveResults([])
  }, [location.pathname])

  // Live search
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setLiveResults([])
      setShowDropdown(false)
      return
    }
    setLiveLoading(true)
    api.animeSearch(debouncedQuery.trim(), 1)
      .then(res => {
        const items = res?.data || []
        setLiveResults(items.slice(0, 6))
        setShowDropdown(items.length > 0)
      })
      .catch(() => {})
      .finally(() => setLiveLoading(false))
  }, [debouncedQuery])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
      setShowDropdown(false)
    }
  }

  const handleResultClick = (slug) => {
    navigate(`/anime/${slug}`)
    setSearchOpen(false)
    setSearchQuery('')
    setShowDropdown(false)
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>▶</span>
          <span className={styles.logoText}><span className={styles.logoAccent}></span></span>
        </Link>

        <div className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
          <Link to="/" className={styles.link}>Home</Link>
          <Link to="/browse" className={styles.link}>Browse</Link>
          <div className={styles.dropdown}>
            <span className={styles.link}>Genres ▾</span>
            <div className={styles.dropdownMenu}>
              {GENRES.map(g => (
                <Link key={g} to={`/genre/${g}`} className={styles.dropdownItem}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/top" className={styles.link}>Top Anime</Link>
        </div>

        <div className={styles.actions}>
          {searchOpen ? (
            <div className={styles.searchWrap} ref={dropdownRef}>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                  ref={inputRef}
                  autoFocus
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowDropdown(false) }}
                  placeholder="Search anime..."
                  className={styles.searchInput}
                />
                {liveLoading && <div className={styles.navSpinner} />}
                <button type="submit" className={styles.searchBtn}>⏎</button>
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); setShowDropdown(false) }} className={styles.searchClose}>✕</button>
              </form>

              {showDropdown && (
                <div className={styles.liveDropdown}>
                  {liveResults.map((item) => (
                    <button key={item.slug} onClick={() => handleResultClick(item.slug)} className={styles.liveItem}>
                      {item.thumbnail && <img src={item.thumbnail} alt="" className={styles.liveThumb} />}
                      <div className={styles.liveInfo}>
                        <p className={styles.liveTitle}>{item.title}</p>
                        {item.type && <p className={styles.liveSub}>{item.type}</p>}
                      </div>
                    </button>
                  ))}
                  <button
                    className={styles.liveViewAll}
                    onClick={() => { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setSearchOpen(false); setSearchQuery(''); setShowDropdown(false) }}
                  >
                    View all results for "{searchQuery}" →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => { setSearchOpen(true); setTimeout(() => inputRef.current?.focus(), 50) }} className={styles.iconBtn} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          )}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>
    </nav>
  )
}
