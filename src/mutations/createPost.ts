import { makeClient } from "@/app/ApolloWrapper";
import { CreatePostDocument } from "@/app/graphql/generated";
import { PostFormData } from "@/lib/schema/post";

export async function createPost(formData: PostFormData) {
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

  const client = makeClient();
  const { data } = await client.mutate({
    mutation: CreatePostDocument,
    variables: {
      input: {
        postInput: {
          title: formData.title,
          content: formData.content,
          published: formData.status === 'published',
          thumbnail
        }
      }
    }
  });

  if (!data || !data.createPost) {
    throw new Error('作成中にエラーが発生しました。しばらく経ってから再度試してください。');
  }

  return data.createPost;
}
