import { User } from "@/app/graphql";
import ProfileForm from "@/components/ui/ProfileForm";
import { getCurrentUser } from "@/fetcher";

export default async function ProfilePage() {
  const user = await getCurrentUser() as User;

  return (
    <div className="flex justify-center">
      <ProfileForm
        email={user.email}
        name={user.name}
        profileImageUrl={user.userImage?.profile || undefined}
      />
    </div>
  );
}
