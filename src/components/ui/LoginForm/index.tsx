"use client";

import { useState } from "react";;
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./LoginForm.module.css";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import FormInput from "@/components/ui/FormInput";
import { login } from "@/actions/login";
import { LoginFormData, loginSchema } from "@/lib/schema/login";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(data);
    } catch(error) {
      if (!isRedirectError(error)) setErrorMessage('ログインに失敗しました。しばらく経ってから再度試してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <Card title="アカウントにログインする">
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
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
