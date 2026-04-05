import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.icon}>▶</span>
          <span className={styles.name}>Hindi<span>AnimeDub</span></span>
          <p className={styles.tagline}>Watch Anime Dubbed — For Free</p>
        </div>
        <div className={styles.links}>
          <div className={styles.col}>
            <h4>Anime</h4>
            <Link to="/browse">Browse</Link>
            <Link to="/top">Top Anime</Link>
            <Link to="/genre/action">Action</Link>
            <Link to="/genre/romance">Romance</Link>
          </div>
          <div className={styles.col}>
            <h4>Genres</h4>
            <Link to="/genre/fantasy">Fantasy</Link>
            <Link to="/genre/comedy">Comedy</Link>
            <Link to="/genre/horror">Horror</Link>
            <Link to="/genre/sports">Sports</Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© 2026 hindianimedub.site — For Entertainment Only</p>
        <p>Disclaimer: We do not store any files. All content is scraped from third-party sources.</p>
      </div>
    </footer>
  )
}
