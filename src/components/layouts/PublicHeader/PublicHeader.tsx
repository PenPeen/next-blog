import Image from 'next/image'
import styles from './PublicHeader.module.css'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import SearchBox from '@/components/ui/SearchBox'
import { getCurrentUser } from '@/app/(auth)/fetcher'
import UserDropDownMenu from '@/components/ui/UserDropDownMenu'

export default async function PublicHeader() {
  const currentUser = await getCurrentUser();

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

            {currentUser ? (
              <>
                <UserDropDownMenu user={currentUser} />
              </>
            ) : (
              <Link href="/signin">
                <Button type="neutral">ログイン</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
