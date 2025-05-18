"use client";

import { useState } from "react";;
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./LoginForm.module.css";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import FormInput from "@/components/ui/FormInput";
import { login } from "@/actions/login";

const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      await login(formData);
    } catch(error: unknown) {
      // NEXT_REDIRECTエラーはリダイレクト処理なので除外
      if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <Card title="アカウントにログインする">
          {error && (
            <div className={styles.errorAlert}>{error}</div>
          )}

          <FormProvider {...methods}>
            <form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)}>
              <div className={styles.formFields}>
                <FormInput
                  name="email"
                  label="メールアドレス"
                  type="email"
                  placeholder="例）example@example.com"
                  required
                  autoComplete="email"
                />

                <FormInput
                  name="password"
                  label="パスワード"
                  type="password"
                  placeholder="例）password123"
                  required
                  helpText="6文字以上の文字列"
                  autoComplete="current-password"
                />
              </div>

              <div>
                <Button
                  type="primary"
                  size="large"
                  buttonType="submit"
                  isSolid
                  isFull
                  isDisabled={isLoading}
                >
                  {isLoading ? "ログイン中..." : "ログイン"}
                </Button>
              </div>

              <div className={styles.registerLink}>
                <p>初めてご利用ですか？ <Link href="/register">新規登録はこちら</Link></p>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </div>
  );
}
