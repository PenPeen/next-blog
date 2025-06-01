import { CommentItemFragment } from '@/app/graphql/generated';
import CommentList from '@/components/ui/CommentList';
import { getPost } from '@/fetcher';

type Params = {
  postId: string;
}

export default async function CommentListContainer({ postId }: Params) {
  const data = await getPost(postId);
  const initialComments = data.postCommentsCursor.edges.map(edge => edge.node) as CommentItemFragment[];
  const endCursor = data.postCommentsCursor.pageInfo.endCursor || '';

  return (
    <CommentList comments={initialComments} postId={postId} endCursor={endCursor} />
  );
}
