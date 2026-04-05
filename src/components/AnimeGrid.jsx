import AnimeCard from './AnimeCard.jsx'
import styles from './AnimeGrid.module.css'

export function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`skeleton ${styles.skeletonThumb}`}/>
      <div className={styles.skeletonInfo}>
        <div className={`skeleton ${styles.skeletonTitle}`}/>
        <div className={`skeleton ${styles.skeletonSub}`}/>
      </div>
    </div>
  )
}

export default function AnimeGrid({ items, loading, cols = 6 }) {
  if (loading) {
    return (
      <div className={styles.grid} style={{ '--cols': cols }}>
        {Array.from({ length: cols * 2 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!items?.length) {
    return (
      <div className={styles.empty}>
        <span>🔍</span>
        <p>No results found</p>
      </div>
    )
  }

  return (
    <div className={styles.grid} style={{ '--cols': cols }}>
      {items.map((anime, i) => (
        <AnimeCard key={anime.slug || i} anime={anime} />
      ))}
    </div>
  )
}
