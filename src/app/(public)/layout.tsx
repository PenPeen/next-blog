import styles from "./layout.module.css";
import "@/app/globals.css";
import PublicHeader from "@/components/layouts/PublicHeader/PublicHeader";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={styles.container}>
      <PublicHeader />
      {children}
    </main>
  );
}
