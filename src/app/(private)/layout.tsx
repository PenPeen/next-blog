import styles from "./layout.module.css";
import "@/app/globals.css";
import PrivateHeader from "@/components/layouts/PrivateHeader/PrivateHeader";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={styles.container}>
      <PrivateHeader />
      {children}
    </main>
  );
}
