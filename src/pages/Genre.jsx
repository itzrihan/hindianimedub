import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../utils/api.js'
import { useFetch } from '../hooks/useFetch.js'
import AnimeGrid from '../components/AnimeGrid.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import styles from './Browse.module.css'

export default function Genre() {
  const { genre } = useParams()
  const [page, setPage] = useState(1)
  const { data, loading, error } = useFetch(() => api.animeGenre(genre, page), [genre, page])

  const items = data?.data || []
  const pagination = data?.pagination || null
  const pages = pagination?.pages || []
  const hasNext = pagination?.hasNextPage ?? data?.hasNextPage ?? false
  const hasPrev = pagination?.hasPrevPage ?? (page > 1)
  const totalPages = pagination?.totalPages || null

  const genreLabel = genre?.charAt(0).toUpperCase() + genre?.slice(1)

  return (
    <div className={`container ${styles.page}`}>
      <SectionHeader title={`${genreLabel} Anime`} subtitle={`Page ${page}${totalPages ? ` of ${totalPages}` : ''}`} />
      {error && <div className={styles.error}>⚠️ {error}</div>}
      <AnimeGrid items={items} loading={loading} cols={6} />
      <div className={styles.pagination}>
        <button onClick={() => { setPage(p => Math.max(1,p-1)); window.scrollTo(0,0) }} disabled={!hasPrev} className={styles.pageBtn}>← Prev</button>
        {pages.length > 0 && (
          <div className={styles.pageNumbers}>
            {pages.map(p => (
              <button key={p} onClick={() => { setPage(p); window.scrollTo(0,0) }}
                className={`${styles.pageNumBtn} ${p === page ? styles.pageNumActive : ''}`}>{p}</button>
            ))}
            {totalPages && !pages.includes(totalPages) && (
              <>
                <span className={styles.pageDots}>…</span>
                <button onClick={() => { setPage(totalPages); window.scrollTo(0,0) }} className={styles.pageNumBtn}>{totalPages}</button>
              </>
            )}
          </div>
        )}
        {pages.length === 0 && <span className={styles.pageNum}>Page {page}</span>}
        <button onClick={() => { setPage(p => p+1); window.scrollTo(0,0) }} disabled={!hasNext && !loading} className={styles.pageBtn}>Next →</button>
      </div>
    </div>
  )
}
