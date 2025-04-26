import Image from 'next/image'
import styles from './PublicHeader.module.css'
import { Button } from '../ui/Button/Button'
import Link from 'next/link'
import SearchBox from '../search/SearchBox'

export default function PublicHeader() {
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
            <SearchBox />

            <Link href="/signin">
              <Button type="neutral">ログイン</Button>
            </Link>
            <Button>登録</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
