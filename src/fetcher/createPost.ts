import { makeClient } from "@/app/ApolloWrapper";
import { CREATE_POST } from "@/graphql/mutations/createPost";

type CreatePostInput = {
  title: string;
  content: string;
  published: boolean;
  thumbnail?: File;
};

type CreatePostVariables = {
  input: {
    title: string;
    content: string;
    published: boolean;
    thumbnail?: string;
  }
};

export async function createPost(input: CreatePostInput) {
  const client = makeClient();

  const variables: CreatePostVariables = {
    input: {
      title: input.title,
      content: input.content,
      published: input.published
    }
  };

  if (input.thumbnail) {
    const file = input.thumbnail;
    const reader = new FileReader();
    const thumbnail = await new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });

    variables.input.thumbnail = thumbnail;
  }

  const { data } = await client.mutate({
    mutation: CREATE_POST,
    variables
  });

  return data.createPost;
}
