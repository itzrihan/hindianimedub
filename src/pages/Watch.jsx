import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../utils/api.js'
import { useFetch } from '../hooks/useFetch.js'
import styles from './Watch.module.css'

const API_BASE = 'https://anime-world-api-omega.vercel.app/api'

// ── Season Dropdown ──────────────────────────────────────────────────────────
function SeasonDropdown({ seasons, selectedSeason, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = seasons.find(s => s.number === selectedSeason?.number) || seasons[seasons.length - 1] || null
  const label = current ? current.name : 'All Seasons'

  return (
    <div className={styles.seasonDropdownWrap} ref={ref}>
      <p className={styles.seasonDropdownLabel}>CHOOSE SEASON</p>
      <button
        className={`${styles.seasonDropdownTrigger} ${open ? styles.seasonDropdownOpen : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>{label}</span>
        <svg className={`${styles.chevron} ${open ? styles.chevronUp : ''}`}
          width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className={styles.seasonDropdownMenu}>
          {seasons.map(s => (
            <button key={s.number}
              className={`${styles.seasonDropdownItem} ${selectedSeason?.number === s.number ? styles.seasonDropdownItemActive : ''}`}
              onClick={() => { onChange(s); setOpen(false) }}
            >
              {s.name}
              {s.episodeCount && <span className={styles.seasonDropdownEpCount}>{s.episodeCount} eps</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer({ episodeSlug }) {
  const [embedUrl, setEmbedUrl] = useState(null)
  const [servers, setServers] = useState([])
  const [activeServer, setActiveServer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const playerRef = useRef(null)
  const iframeRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setEmbedUrl(null)
    setServers([])

    fetch(`${API_BASE}/episode/${episodeSlug}`)
      .then(res => {
        if (!res.ok) throw new Error(`API error ${res.status}`)
        return res.json()
      })
      .then(res => {
        const srvList = res?.data?.servers || res?.data?.links || []
        setServers(srvList)
        const preferred = srvList.find(s =>
          s.name?.toLowerCase() === 'abyss' || s.label?.toLowerCase() === 'abyss'
        ) || srvList[0]
        if (!preferred) throw new Error('No servers found for this episode')
        const url = preferred.embed || preferred.url || preferred.link || preferred.src
        if (!url) throw new Error('No embed URL found')
        setActiveServer(preferred.name || preferred.label || 'Server 1')
        setEmbedUrl(url)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [episodeSlug])

  const switchServer = (srv) => {
    const url = srv.embed || srv.url || srv.link || srv.src
    if (!url) return
    setActiveServer(srv.name || srv.label)
    setEmbedUrl(url)
  }

  const handleFullscreen = async () => {
    const el = playerRef.current
    if (!el) return

    try {
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) {
          await el.requestFullscreen()
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen()
        }

        // Force landscape on mobile
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock('landscape')
        }
      } else {
        await document.exitFullscreen()
        // Unlock orientation when exiting
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock()
        }
      }
    } catch (err) {
      console.log('Fullscreen error:', err)
    }
  }

  if (loading) return (
    <div className={styles.playerWrap}>
      <div className={styles.playerBox}>
        <div className={styles.playerLoading}>
          <div className={styles.spinner}/>
          <p>Loading episode...</p>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className={styles.playerWrap}>
      <div className={styles.playerBox}>
        <div className={styles.playerError}>⚠️ Could not load episode: {error}</div>
      </div>
    </div>
  )

  return (
    <div className={styles.playerWrap}>
      <div className={styles.playerBox} ref={playerRef}>
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className={styles.iframe}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          title=""
        />
        <button className={styles.fullscreenBtn} onClick={handleFullscreen} title="Full Screen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
        </button>
      </div>

      {/* Servers BELOW video */}
      {servers.length > 1 && (
        <div className={styles.servers}>
          <span className={styles.serversLabel}>Servers:</span>
          {servers.map((srv, i) => {
            const name = srv.name || srv.label || `Server ${i + 1}`
            return (
              <button key={i} onClick={() => switchServer(srv)}
                className={`${styles.serverBtn} ${activeServer === name ? styles.serverActive : ''}`}>
                {name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main Watch Page ───────────────────────────────────────────────────────────
export default function Watch() {
  const { id } = useParams()
  const animeSlug = id?.replace(/-\d+x\d+$/, '').replace(/-episode-\d+$/, '') || ''

  const [selectedSeason, setSelectedSeason] = useState(null)
  const [defaultSet, setDefaultSet] = useState(false)

  const { data: animeData } = useFetch(
    () => animeSlug
      ? api.animeDetail(animeSlug, selectedSeason?.number, selectedSeason?.slug)
      : Promise.resolve(null),
    [animeSlug, selectedSeason?.number, selectedSeason?.slug]
  )

  useEffect(() => {
    if (!defaultSet && animeData?.data?.seasons?.length > 0) {
      const s = animeData.data.seasons
      setSelectedSeason(s[s.length - 1])
      setDefaultSet(true)
    }
  }, [animeData, defaultSet])

  const anime = animeData?.data
  const episodes = anime?.episodes || []
  const seasons = anime?.seasons || []
  const currentSeason = anime?.currentSeason || selectedSeason || null

  const currentIdx = episodes.findIndex(ep => ep.slug === id)
  const prevEp = currentIdx > 0 ? episodes[currentIdx - 1] : null
  const nextEp = currentIdx >= 0 && currentIdx < episodes.length - 1 ? episodes[currentIdx + 1] : null
  const currentEp = episodes[currentIdx]

  const EPISODES_PER_PAGE = 50
  const totalEpPages = Math.ceil(episodes.length / EPISODES_PER_PAGE)
  const [epPage, setEpPage] = useState(0)

  useEffect(() => {
    if (currentIdx >= 0) setEpPage(Math.floor(currentIdx / EPISODES_PER_PAGE))
  }, [currentIdx])

  useEffect(() => { setEpPage(0) }, [selectedSeason?.number])

  const pagedEpisodes = episodes.slice(epPage * EPISODES_PER_PAGE, (epPage + 1) * EPISODES_PER_PAGE)

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>

        {/* Title bar */}
        <div className={styles.titleBar}>
          {animeSlug && (
            <Link to={`/anime/${animeSlug}`} className={styles.backLink}>← Go Back</Link>
          )}
          <div>
            {anime && <h1 className={styles.animeTitle}>{anime.title}</h1>}
            {currentEp && (
              <p className={styles.epLabel}>
                {currentEp.season && <span className={styles.epSeasonTag}>{currentEp.season}</span>}
                {' '}Episode {currentEp.number}: {currentEp.title}
              </p>
            )}
          </div>
        </div>

        {/* Player */}
        <VideoPlayer episodeSlug={id} />

        {/* Prev / Next nav */}
        <div className={styles.epNav}>
          {prevEp
            ? <Link to={`/watch/${prevEp.slug}`} className={styles.navBtn}>← Previous Episode</Link>
            : <div />}
          {nextEp && (
            <Link to={`/watch/${nextEp.slug}`} className={styles.navBtn}>Next Episode →</Link>
          )}
        </div>

        {/* Season dropdown + Episode list */}
        {(episodes.length > 0 || seasons.length > 1) && (
          <div className={styles.epListSection}>
            <div className={styles.epListHeader}>
              <div className={styles.epListHeaderLeft}>
                <h2 className={styles.epListTitle}>
                  Episodes ({episodes.length})
                  {currentSeason && (
                    <span className={styles.epListSeasonTag}>{currentSeason.name}</span>
                  )}
                </h2>
                {seasons.length > 1 && (
                  <SeasonDropdown
                    seasons={seasons}
                    selectedSeason={selectedSeason}
                    onChange={setSelectedSeason}
                  />
                )}
              </div>
              {totalEpPages > 1 && (
                <div className={styles.epPageBtns}>
                  {Array.from({ length: totalEpPages }, (_, i) => (
                    <button key={i} onClick={() => setEpPage(i)}
                      className={`${styles.epPageBtn} ${epPage === i ? styles.epPageBtnActive : ''}`}>
                      {i * EPISODES_PER_PAGE + 1}–{Math.min((i + 1) * EPISODES_PER_PAGE, episodes.length)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.epList}>
              {pagedEpisodes.map((ep, i) => {
                const globalIdx = epPage * EPISODES_PER_PAGE + i
                return (
                  <Link
                    key={ep.slug || globalIdx}
                    to={`/watch/${ep.slug}`}
                    className={`${styles.epItem} ${ep.slug === id ? styles.epItemActive : ''}`}
                  >
                    <span className={styles.epItemNum}>{ep.number || globalIdx + 1}</span>
                    <span className={styles.epItemTitle}>{ep.title}</span>
                    {ep.season && <span className={styles.epItemSeason}>{ep.season}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
