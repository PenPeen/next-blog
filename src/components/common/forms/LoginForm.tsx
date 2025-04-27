"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./LoginForm.module.css";
import Button from "@/components/ui/Button/Button";
import Card from "@/components/ui/Card/Card";

const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // TODO: Login
      console.log('ログイン処理:', data);
    } catch {
      setErrorMessage("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <Card title="アカウントにログインする">
          {errorMessage && (
            <div className={styles.errorAlert}>
              {errorMessage}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formFields}>
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
                  autoComplete="current-password"
                  {...register("password")}
                  className={`${styles.fieldInput} ${errors.password ? styles.fieldInputError : ""}`}
                  placeholder="例）password123"
                />
                <p className={styles.helpText}>6文字以上の文字列</p>
                {errors.password && (
                  <p className={styles.errorMessage}>{errors.password.message}</p>
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
                {isLoading ? "ログイン中..." : "ログイン"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
