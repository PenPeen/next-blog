import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
  passwordConfirmation: z.string().min(6, "パスワード（確認）を入力してください"),
  agreement: z.boolean().refine(value => value === true, { message: "利用規約に同意する必要があります" })
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "パスワードが一致しません",
  path: ["passwordConfirmation"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
