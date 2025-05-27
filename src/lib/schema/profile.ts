import { z } from "zod";

export const profileSchema = z.object({
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

export type ProfileFormData = z.infer<typeof profileSchema>;
