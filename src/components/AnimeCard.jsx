import { Link } from 'react-router-dom'
import styles from './AnimeCard.module.css'

export default function AnimeCard({ anime, size = 'normal' }) {
  const { title, slug, thumbnail, rating, episodes, season, type } = anime

  const href = slug?.includes('-episode-') || slug?.includes('x')
    ? `/watch/${slug}`
    : `/anime/${slug}`

  return (
    <Link to={href} className={`${styles.card} ${styles[size]}`}>
      <div className={styles.thumb}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
          />
        ) : null}
        <div className={styles.placeholder} style={{display: thumbnail ? 'none' : 'flex'}}>
          <span>🎌</span>
        </div>
        <div className={styles.overlay}>
          <div className={styles.playBtn}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        {rating && <span className={styles.rating}>⭐ {rating}</span>}
        {episodes && <span className={styles.eps}>{episodes}</span>}
        {type && <span className={styles.type}>{type}</span>}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        {season && <p className={styles.season}>{season}</p>}
      </div>
    </Link>
  )
}
