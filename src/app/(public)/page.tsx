import Card from "@/components/ui/Card/Card";
import styles from './page.module.css';
import { Post } from "@/app/types/post";
import Link from "next/link";
import { getPosts } from "@/app/(public)/posts/fetcher";

export default async function Home() {
  const posts = await getPosts();

  return (
    <div>
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
    </div>
  );
}
