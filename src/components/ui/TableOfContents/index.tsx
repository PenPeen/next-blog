import { PostHeading } from '@/lib/postHeadings'
import styles from './TableOfContents.module.css'

export default function TableOfContents({ headings }: { headings: PostHeading[] }) {
  if (headings.length === 0) return null

  return (
    <nav className={styles.container} aria-label="目次">
      <p className={styles.title}>目次</p>
      <ol className={styles.list}>
        {headings.map((heading) => (
          <li key={heading.id} className={styles[`level${heading.level}`]}>
            <a href={`#${heading.id}`} className={styles.link}>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
