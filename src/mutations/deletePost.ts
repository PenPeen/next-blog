import { makeClient } from "@/app/ApolloWrapper";
import { DeletePostDocument } from "@/app/graphql/generated";

export async function deletePost(postId: string) {
  const client = makeClient();
  const { data } = await client.mutate({
    mutation: DeletePostDocument,
    variables: {
      input: {
        id: postId
      }
    }
  });

  if (!data || !data.deletePost) {
    throw new Error('投稿を削除できませんでした。しばらく経ってから再度試してください。');
  }

  return data.deletePost;
}
