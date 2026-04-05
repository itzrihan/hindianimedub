import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../utils/api.js'
import { useFetch } from '../hooks/useFetch.js'
import AnimeGrid from '../components/AnimeGrid.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import styles from './Browse.module.css'
import searchStyles from './Search.module.css'

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [page, setPage] = useState(1)
  const [input, setInput] = useState(query)
  const inputRef = useRef(null)

  // Live search with debounce
  const debouncedInput = useDebounce(input, 400)

  // Sync input from URL param on mount
  useEffect(() => { setInput(query) }, [query])

  // Update URL when debounced input changes
  useEffect(() => {
    if (debouncedInput.trim() && debouncedInput !== query) {
      setSearchParams({ q: debouncedInput.trim() })
      setPage(1)
    }
  }, [debouncedInput])

  const { data, loading, error } = useFetch(
    () => query ? api.animeSearch(query, page) : Promise.resolve({ data: [] }),
    [query, page]
  )

  const items = data?.data || []
  const pagination = data?.pagination || null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      setSearchParams({ q: input.trim() })
      setPage(1)
    }
  }

  return (
    <div className={`container ${styles.page}`}>
      <form onSubmit={handleSubmit} className={searchStyles.searchBar}>
        <div className={searchStyles.inputWrap}>
          <svg className={searchStyles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search anime... (results appear as you type)"
            className={searchStyles.input}
            autoFocus
          />
          {loading && input && (
            <div className={searchStyles.liveSpinner} />
          )}
          {input && (
            <button type="button" onClick={() => { setInput(''); setSearchParams({}); inputRef.current?.focus() }}
              className={searchStyles.clearBtn}>✕</button>
          )}
        </div>
        <button type="submit" className={searchStyles.btn}>Search</button>
      </form>

      {query && (
        <SectionHeader
          title={`Results for "${query}"`}
          subtitle={items.length ? `${items.length} found` : loading ? 'Searching…' : 'No results'}
        />
      )}

      {error && <div className={styles.error}>⚠️ {error}</div>}

      {query ? (
        <>
          <AnimeGrid items={items} loading={loading} cols={6} />
          {pagination ? (
            <div className={styles.pagination}>
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={!pagination.hasPrevPage} className={styles.pageBtn}>← Previous</button>
              <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
                {(pagination.pages || []).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`${styles.pageBtn} ${p === page ? styles.pageActive : ''}`}
                    style={{minWidth:36,height:36,padding:'0 6px'}}>
                    {p}
                  </button>
                ))}
              </div>
              <button onClick={() => setPage(p => p+1)} disabled={!pagination.hasNextPage} className={styles.pageBtn}>Next →</button>
            </div>
          ) : (
            (data?.hasNextPage || page > 1) && (
              <div className={styles.pagination}>
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className={styles.pageBtn}>← Previous</button>
                <span style={{fontSize:14,color:'var(--text-muted)'}}>Page {page}</span>
                <button onClick={() => setPage(p => p+1)} disabled={!data?.hasNextPage} className={styles.pageBtn}>Next →</button>
              </div>
            )
          )}
        </>
      ) : (
        <div className={searchStyles.empty}>
          <span>🔍</span>
          <p>Search for your favourite anime</p>
          <p className={searchStyles.emptySub}>Results appear as you type</p>
        </div>
      )}
    </div>
  )
}
