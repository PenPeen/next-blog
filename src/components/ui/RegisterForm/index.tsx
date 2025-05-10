"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { register as registerAction } from "@/actions/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./RegisterForm.module.css";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
  passwordConfirmation: z.string().min(6, "パスワード（確認）を入力してください"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "パスワードが一致しません",
  path: ["passwordConfirmation"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null);

    try {
      const result = await registerAction(data);

      if (result.success) {
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        }
      } else {
        setError(result.error || "ユーザー登録に失敗しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <Card title="新規登録">
          {error && (
            <div className={styles.errorAlert}>
              {error}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formFields}>
              <div className={styles.formField}>
                <label htmlFor="name" className={styles.fieldLabel}>
                  名前
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                  className={`${styles.fieldInput} ${errors.name ? styles.fieldInputError : ""}`}
                  placeholder="例）山田太郎"
                />
                {errors.name && (
                  <p className={styles.errorMessage}>{errors.name.message}</p>
                )}
              </div>

              <div className={styles.formField}>
                <label htmlFor="email" className={styles.fieldLabel}>
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`${styles.fieldInput} ${errors.email ? styles.fieldInputError : ""}`}
                  placeholder="例）example@example.com"
                />
                {errors.email && (
                  <p className={styles.errorMessage}>{errors.email.message}</p>
                )}
              </div>

              <div className={styles.formField}>
                <label htmlFor="password" className={styles.fieldLabel}>
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                  className={`${styles.fieldInput} ${errors.password ? styles.fieldInputError : ""}`}
                  placeholder="例）password123"
                />
                <p className={styles.helpText}>6文字以上の文字列</p>
                {errors.password && (
                  <p className={styles.errorMessage}>{errors.password.message}</p>
                )}
              </div>

              <div className={styles.formField}>
                <label htmlFor="passwordConfirmation" className={styles.fieldLabel}>
                  パスワード（確認）
                </label>
                <input
                  id="passwordConfirmation"
                  type="password"
                  autoComplete="new-password"
                  {...register("passwordConfirmation")}
                  className={`${styles.fieldInput} ${errors.passwordConfirmation ? styles.fieldInputError : ""}`}
                  placeholder="例）password123"
                />
                {errors.passwordConfirmation && (
                  <p className={styles.errorMessage}>{errors.passwordConfirmation.message}</p>
                )}
              </div>
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
                {isLoading ? "登録中..." : "登録する"}
              </Button>
            </div>

            <div className={styles.registerLink}>
              <p>アカウントをお持ちの方は <Link href="/signin">こちらからログイン</Link></p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
