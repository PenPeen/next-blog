import Card from "@/components/ui/Card/Card";
import styles from './page.module.css';
import Link from "next/link";
import { getPosts } from "@/app/(public)/posts/fetcher";
import { Post } from "../types";

export default async function Home() {
  const posts = await getPosts();
  const postsJson = await posts.json();

  return (
    <div>
        <div className={styles.cardContainer}>
          {postsJson.map((post: Post) => {
            return(
              <Link href={`/posts/${post.id}`} key={post.id}>
                <Card
                  img={post.thumbnailUrl}
                  title={post.title}
                  description={post.content}
                  variant="post"
                  unoptimized={true}
                  maxLines={3}
                  titleMaxLines={true}
                  />
              </Link>
            )
          })}
        </div>
    </div>
  );
}
