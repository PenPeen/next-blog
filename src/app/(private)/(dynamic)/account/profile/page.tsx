import { User } from "@/app/graphql";
import ProfileForm from "@/components/ui/ProfileForm";
import { getCurrentUser } from "@/fetcher";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile of PenBlog App",
};

export default async function ProfilePage() {
  const user = await getCurrentUser() as User;

  return (
    <ProfileForm
      email={user.email}
      name={user.name}
      profileImageUrl={user.userImage?.profile || undefined}
    />
  );
}
