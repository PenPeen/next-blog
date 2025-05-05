import Image from 'next/image'
import styles from './PrivateHeader.module.css'
import Link from 'next/link'
import UserDropDownMenu from '@/components/ui/UserDropDownMenu'
import { getCurrentUser } from '@/fetcher/getCurrentUser';
import { User } from '@/app/graphql';
export default async function PrivateHeader() {
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
            <UserDropDownMenu user={currentUser as User} />
          </div>
        </div>
      </div>
    </header>
  )
}
