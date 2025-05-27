"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { register as registerAction } from "@/actions/register";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./RegisterForm.module.css";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import FormInput from "@/components/ui/FormInput";
import FormCheckBox from "@/components/ui/FormCheckBox";
import { RegisterFormData, registerSchema } from "@/lib/schema/register";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      await registerAction(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <Card title="新規登録">
          <FormProvider {...methods}>
            <form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)}>
              <div className={styles.formFields}>
                <FormInput
                  name="name"
                  label="名前"
                  placeholder="例）山田太郎"
                  required
                  autoComplete="name"
                />

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
                  autoComplete="new-password"
                />

                <FormInput
                  name="passwordConfirmation"
                  label="パスワード（確認）"
                  type="password"
                  placeholder="例）password123"
                  required
                  autoComplete="new-password"
                />
              </div>

              <FormCheckBox
                name="agreement"
                label="利用規約に同意する"
                required
              />

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
          </FormProvider>
        </Card>
      </div>
    </div>
  );
}
