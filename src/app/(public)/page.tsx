import Card from "@/components/ui/Card/Card";
import styles from './page.module.css';
import { Post } from "@/app/types/post";
import Link from "next/link";

export default async function Home() {
  const posts = await fetch(`http://${process.env.NEXT_PUBLIC_RAILS_API_DOMAIN}/api/v1/posts`).then(res => res.json());

  return (
    <div>
      <main className={styles.container}>
        <div className={styles.cardContainer}>
          {posts.map((post: Post) => {
            return(
              <Link href={`/posts/${post.id}`} key={post.id}>
                <Card
                  img={post.thumbnail_url}
                  title={post.title}
                  description={post.content}
                  variant="post"
                  unoptimized={true}
                  />
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  );
}
