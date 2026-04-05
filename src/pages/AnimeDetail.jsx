import { useState, useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../utils/api.js'
import { useFetch } from '../hooks/useFetch.js'
import styles from './AnimeDetail.module.css'

// ── Season Dropdown (matches screenshot) ────────────────────────────────────
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

  const current = seasons.find(s => s.number === selectedSeason) || seasons[seasons.length - 1] || null
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
            <button
              key={s.number}
              className={`${styles.seasonDropdownItem} ${selectedSeason === s.number ? styles.seasonDropdownItemActive : ''}`}
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

// ── Main Component ──────────────────────────────────────────────────────────
export default function AnimeDetail() {
  const { id } = useParams()

  // selectedSeason stores the full SeasonInfo object so we have the slug too
  const [selectedSeason, setSelectedSeason] = useState(null)
  const [defaultSet, setDefaultSet] = useState(false)

  const { data, loading, error } = useFetch(
    () => api.animeDetail(id, selectedSeason?.number, selectedSeason?.slug),
    [id, selectedSeason?.number, selectedSeason?.slug]
  )

  // Auto-select latest season on first load
  useEffect(() => {
    if (!defaultSet && data?.data?.seasons?.length > 0) {
      const seasons = data.data.seasons
      setSelectedSeason(seasons[seasons.length - 1])
      setDefaultSet(true)
    }
  }, [data, defaultSet])

  const anime = data?.data

  if (loading) return (
    <div className={`container ${styles.page}`}>
      <div className={styles.loadingWrap}>
        <div className={styles.spinner}/>
        <p>Loading...</p>
      </div>
    </div>
  )

  if (error || !anime) return (
    <div className={`container ${styles.page}`}>
      <div className={styles.errorBox}>⚠️ Anime not found</div>
    </div>
  )

  const seasons = anime.seasons || []
  const currentSeason = anime.currentSeason || selectedSeason || null

  return (
    <div className={styles.page}>
      {/* Backdrop */}
      <div className={styles.backdrop}>
        {anime.thumbnail && <img src={anime.thumbnail} alt="" aria-hidden="true" />}
        <div className={styles.backdropOverlay}/>
      </div>

      <div className={`container ${styles.content}`}>
        {/* Main Info Row */}
        <div className={styles.infoRow}>
          <div className={styles.poster}>
            {anime.thumbnail
              ? <img src={anime.thumbnail} alt={anime.title} />
              : <div className={styles.posterPlaceholder}>🎌</div>
            }
          </div>
          <div className={styles.details}>
            <h1 className={styles.title}>{anime.title}</h1>

            <div className={styles.meta}>
              {anime.rating && <span className={styles.metaChip}>⭐ {anime.rating}</span>}
              {anime.status && <span className={styles.metaChip}>{anime.status}</span>}
              {anime.releaseYear && <span className={styles.metaChip}>{anime.releaseYear}</span>}
              {anime.type && <span className={styles.metaChip}>{anime.type}</span>}
              {currentSeason && (
                <span className={`${styles.metaChip} ${styles.metaSeasonChip}`}>
                  📺 {currentSeason.name}
                </span>
              )}
            </div>

            {anime.genres?.length > 0 && (
              <div className={styles.genres}>
                {anime.genres.map(g => (
                  <Link key={g} to={`/genre/${g.toLowerCase()}`} className={styles.genre}>{g}</Link>
                ))}
              </div>
            )}

            {anime.description && (
              <p className={styles.description}>{anime.description}</p>
            )}

            {/* Season Dropdown — only shown when multiple seasons exist */}
            {seasons.length > 1 && (
              <SeasonDropdown
                seasons={seasons}
                selectedSeason={selectedSeason?.number ?? null}
                onChange={setSelectedSeason}
              />
            )}

            {anime.episodes?.length > 0 && (
              <Link to={`/watch/${anime.episodes[0].slug}`} className={styles.watchBtn}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch {currentSeason ? currentSeason.name : 'First'} Episode
              </Link>
            )}
          </div>
        </div>

        {/* Episodes */}
        {anime.episodes?.length > 0 && (
          <div className={styles.episodesSection}>
            <h2 className={styles.epTitle}>
              Episodes ({anime.episodes.length})
              {currentSeason && (
                <span className={styles.epSeasonTag}>{currentSeason.name}</span>
              )}
            </h2>
            <div className={styles.episodeGrid}>
              {anime.episodes.map((ep, i) => (
                <Link key={ep.slug || i} to={`/watch/${ep.slug}`} className={styles.epCard}>
                  <div className={styles.epNum}>{ep.number || i + 1}</div>
                  <div className={styles.epInfo}>
                    <p className={styles.epName}>{ep.title}</p>
                    <div className={styles.epMeta}>
                      {ep.season && <span className={styles.epSeason}>{ep.season}</span>}
                      {ep.date && <span className={styles.epDate}>{ep.date}</span>}
                    </div>
                  </div>
                  <div className={styles.epPlay}>▶</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
