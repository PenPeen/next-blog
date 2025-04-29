import Image from 'next/image'
import styles from './PrivateHeader.module.css'
import Link from 'next/link'
import LogoutButton from '@/components/layouts/LogoutButton/LogoutButton'

export default function PrivateHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/app_logo.png"
              alt="PenBlog Logo"
              width={50}
              height={50}
              className={styles.logoImage}
            />
            <h1 className={styles.logoText}>PenBlog</h1>
          </Link>

          <div className={styles.navigation}>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
