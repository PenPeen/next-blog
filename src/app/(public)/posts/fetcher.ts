export async function getPosts () {
  return await fetch(`http://${process.env.NEXT_PUBLIC_RAILS_API_DOMAIN}/api/v1/posts`);
};

export async function getPost (id: string) {
  return await fetch(`http://${process.env.NEXT_PUBLIC_RAILS_API_DOMAIN}/api/v1/posts/${id}`);
};
