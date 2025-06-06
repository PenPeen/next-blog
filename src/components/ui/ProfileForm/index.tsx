"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./ProfileForm.module.css";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FormInput from "@/components/ui/FormInput";
import ProfileFileInput from "../ProfileFileInput";
import { updateProfile } from "@/actions/updateProfile";
import Loading from "@/app/loading";
import { ProfileFormData, profileSchema } from "@/lib/schema/profile";

type ProfileFormProps = {
  email: string;
  name: string;
  profileImageUrl?: string;
};

export default function ProfileForm({ email, name, profileImageUrl }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      email: email,
      name: name,
    },
  });

  useEffect(() => {
    if (email && name) {
      methods.reset({ email, name });
      setIsInitialized(true);
    }
  }, [email, name, methods]);

  if (!isInitialized) {
    return <Loading />;
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateProfile({
        name: data.name,
        profileImage: data.profileImage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <Card title="プロフィール">
          {error && (
            <div className={styles.errorAlert}>
              {error}
            </div>
          )}

          <FormProvider {...methods}>
            <form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)}>
              <div className={styles.formFields}>
                <ProfileFileInput
                  name="profileImage"
                  label="プロフィール画像"
                  helpText="JPG, PNG, GIF (最大2MB)"
                  previewUrl={profileImageUrl}
                />

                <FormInput
                  name="name"
                  label="名前"
                  placeholder="例）山田太郎"
                  required
                  autoComplete="name"
                />
              </div>

              <div className={styles.submitButtonContainer}>
                <Button
                  buttonType="submit"
                  isDisabled={isLoading}
                  isFull
                  type="primary"
                  isSolid
                >
                  {isLoading ? "更新中..." : "更新する"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </div>
  );
}
