import { makeClient } from "@/app/ApolloWrapper";
import { UpdatePostDocument } from "@/app/graphql/generated";
import { PostFormData } from "@/lib/schema/post";

export async function updatePost(postId: string, formData: PostFormData) {
  const client = makeClient();

  let thumbnail = undefined;
  if (formData.thumbnail && formData.thumbnail.length > 0) {
    const file = formData.thumbnail[0];
    const reader = new FileReader();
    thumbnail = await new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });
  }

  const { data } = await client.mutate({
    mutation: UpdatePostDocument,
    variables: {
      input: {
        postInput: {
          id: postId,
          title: formData.title,
          content: formData.content,
          published: formData.status === 'published',
          thumbnail
        }
      }
    }
  });

  if (!data || !data.updatePost) {
    throw new Error('投稿を更新できませんでした。しばらく経ってから再度試してください。');
  }

  return data.updatePost;
}
