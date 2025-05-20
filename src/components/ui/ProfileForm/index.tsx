"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./ProfileForm.module.css";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FormInput from "@/components/ui/FormInput";
import ProfileFileInput from "../ProfileFileInput";
import { updateProfile } from "@/actions/updateProfile";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  name: z.string().min(1, "名前を入力してください").max(10, "名前は10文字以内で入力してください。"),
  profileImage: z.any().optional().refine(
    (files) => {
      if (!files) return true;
      if (files.length === 0) return true;
      if (files.length === 1 && files[0].size <= 2 * 1024 * 1024) return true;
      return false;
    },
    { message: "画像サイズは2MB以下にしてください" }
  )
});

type ProfileFormData = z.infer<typeof profileSchema>;

type ProfileFormProps = {
  email: string;
  name: string;
  profileImageUrl?: string;
};

export default function ProfileForm({ email, name, profileImageUrl }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      email: email,
      name: name,
    },
  });

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
