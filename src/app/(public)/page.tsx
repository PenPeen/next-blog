import PublicHeader from "@/components/layouts/PublicHeader";
import Card from "@/components/ui/Card/Card";
import styles from './page.module.css';

export default function Home() {
  return (
    <div>
      <PublicHeader />
      <main className={styles.container}>
        <div className={styles.cardContainer}>
          <Card
            img="https://placehold.jp/1920x1080.png"
            title="Card Title 1"
            description="Card Description 1"
            variant="post"
          />
          <Card
            img="https://placehold.jp/1920x1080.png"
            title="Card Title 2"
            description="Card Description 2"
            variant="post"
          />
          <Card
            img="https://placehold.jp/1920x1080.png"
            title="Card Title 3"
            description="Card Description 3"
            variant="post"
          />
        </div>
      </main>
    </div>
  );
}
