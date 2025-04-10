import Image from 'next/image'
import styles from './PublicHeader.module.css'
import { Button } from '../ui/Button/Button'
import Link from 'next/link'

export default function PublicHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <Image
              src="/app_logo.png"
              alt="PenBlog Logo"
              width={50}
              height={50}
              className={styles.logoImage}
            />
            <Link href="/">
              <h1 className={styles.logoText}>PenBlog</h1>
            </Link>
          </div>

          <div className={styles.navigation}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="記事を検索..."
                className={styles.searchInput}
              />
            </div>

            <Button type="neutral">ログイン</Button>
            <Button>登録</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
