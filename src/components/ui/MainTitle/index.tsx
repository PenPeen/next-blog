import styles from './MainTitle.module.css';

export default function MainTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className={styles.title}>
      {children}
    </h1>
  )
}
