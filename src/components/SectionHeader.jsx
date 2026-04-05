import { Link } from 'react-router-dom'
import styles from './SectionHeader.module.css'

export default function SectionHeader({ title, subtitle, viewAllHref }) {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div className={styles.bar}/>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {viewAllHref && (
        <Link to={viewAllHref} className={styles.viewAll}>
          View All →
        </Link>
      )}
    </div>
  )
}
