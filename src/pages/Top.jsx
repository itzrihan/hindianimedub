import { api } from '../utils/api.js'
import { useFetch } from '../hooks/useFetch.js'
import AnimeGrid from '../components/AnimeGrid.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import styles from './Browse.module.css'

export default function Top() {
  const { data, loading, error } = useFetch(() => api.animeTop(), [])
  const items = data?.data || []

  return (
    <div className={`container ${styles.page}`}>
      <SectionHeader title="Top Anime" subtitle="Best Dubbed Anime" />
      {error && <div className={styles.error}>⚠️ {error}</div>}
      <AnimeGrid items={items} loading={loading} cols={6} />
    </div>
  )
}
