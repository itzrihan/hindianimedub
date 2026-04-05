import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api.js'
import { useFetch } from '../hooks/useFetch.js'
import AnimeGrid from '../components/AnimeGrid.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import styles from './Home.module.css'

function HeroSlider({ items }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (!items.length) return
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 5500)
    return () => clearInterval(t)
  }, [items.length])

  const anime = items[idx] || null
  if (!anime) return null
  const href = `/anime/${anime.slug}`
  return (
    <div className={styles.hero}>
      <div className={styles.heroBg}>
        {anime.thumbnail && (
          <img key={anime.slug} src={anime.thumbnail} alt="" aria-hidden="true" className={styles.heroBgImg} />
        )}
        <div className={styles.heroBgOverlay} />
      </div>
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>🎌 Dubbed</div>
        <h1 className={styles.heroTitle}>{anime.title}</h1>
        {anime.season && <p className={styles.heroMeta}>{anime.season}</p>}
        {anime.rating && <p className={styles.heroRating}>⭐ {anime.rating}</p>}
        <div className={styles.heroActions}>
          <Link to={href} className={styles.heroBtnPrimary}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>
            Watch Now
          </Link>
          <Link to={href} className={styles.heroBtnSecondary}>Details</Link>
        </div>
      </div>
      {/* Slider dots */}
      <div className={styles.heroDots}>
        {items.slice(0, 6).map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`${styles.heroDot} ${i === idx ? styles.heroDotActive : ''}`}
            aria-label={`Slide ${i+1}`} />
        ))}
      </div>
    </div>
  )
}

function Pagination({ pagination, page, setPage }) {
  if (!pagination) return null
  const { pages = [], hasNextPage, hasPrevPage, totalPages } = pagination
  return (
    <div className={styles.pagination}>
      <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={!hasPrevPage} className={styles.pageBtn}>← Prev</button>
      <div className={styles.pageNumbers}>
        {pages.map(p => (
          <button key={p} onClick={() => setPage(p)}
            className={`${styles.pageNumBtn} ${p === page ? styles.pageNumActive : ''}`}>
            {p}
          </button>
        ))}
        {totalPages && !pages.includes(totalPages) && (
          <>
            <span className={styles.pageDots}>…</span>
            <button onClick={() => setPage(totalPages)} className={styles.pageNumBtn}>{totalPages}</button>
          </>
        )}
      </div>
      <button onClick={() => setPage(p => p+1)} disabled={!hasNextPage} className={styles.pageBtn}>Next →</button>
    </div>
  )
}

export default function Home() {
  const [browsePage, setBrowsePage] = useState(1)
  const { data, loading } = useFetch(() => api.home(), [])
  const { data: browseData, loading: browseLoading } = useFetch(() => api.animeList(browsePage), [browsePage])

  const featured = data?.data?.featured || data?.data?.latestEpisodes || []
  const latest = data?.data?.latestEpisodes || []
  const trending = data?.data?.trending || []

  const browseItems = browseData?.data || []
  const browsePagination = browseData?.pagination || null

  return (
    <div className={styles.page}>
      <HeroSlider items={featured.slice(0, 6)} />

      <div className="container">
        <section className={styles.section}>
          <SectionHeader title="Latest Episodes" subtitle="Fresh Updates" viewAllHref="/browse" />
          <AnimeGrid items={latest} loading={loading} cols={6} />
        </section>

        <section className={styles.section}>
          <SectionHeader title="Trending" subtitle="Most Popular Right Now" viewAllHref="/browse" />
          <AnimeGrid items={trending} loading={loading} cols={6} />
        </section>

        {/* Browse all anime with pagination */}
        <section className={styles.section}>
          <SectionHeader title="All Anime" subtitle={`Page ${browsePage}`} viewAllHref="/browse" />
          <AnimeGrid items={browseItems} loading={browseLoading} cols={6} />
          <Pagination pagination={browsePagination} page={browsePage} setPage={setBrowsePage} />
        </section>

        {/* Genre quick links */}
        <section className={styles.section}>
          <SectionHeader title="Browse by Genre" />
          <div className={styles.genreGrid}>
            {[
              { label: 'Action', slug: 'action', emoji: '⚔️' },
              { label: 'Romance', slug: 'romance', emoji: '💕' },
              { label: 'Fantasy', slug: 'fantasy', emoji: '🧙' },
              { label: 'Comedy', slug: 'comedy', emoji: '😂' },
              { label: 'Horror', slug: 'horror', emoji: '👻' },
              { label: 'Adventure', slug: 'adventure', emoji: '🗺️' },
              { label: 'Sports', slug: 'sports', emoji: '⚽' },
              { label: 'Sci-Fi', slug: 'sci-fi', emoji: '🚀' },
            ].map(g => (
              <Link key={g.slug} to={`/genre/${g.slug}`} className={styles.genreCard}>
                <span className={styles.genreEmoji}>{g.emoji}</span>
                <span className={styles.genreLabel}>{g.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
