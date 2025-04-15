export async function getPosts () {
  const res = await fetch(`http://${process.env.NEXT_PUBLIC_RAILS_API_DOMAIN}/api/v1/posts`);
  return res.json();
};

export async function getPost (id: string) {
  const res = await fetch(`http://${process.env.NEXT_PUBLIC_RAILS_API_DOMAIN}/api/v1/posts/${id}`);
  return res.json();
};
