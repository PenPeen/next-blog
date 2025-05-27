import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "内容は必須です"),
  status: z.string().min(1, "公開状態は必須です"),
  thumbnail: z.any().optional().refine(
    (files) => {
      if (!files) return true;
      if (files.length === 0) return true;
      if (files.length === 1 && files[0].size <= 2 * 1024 * 1024) return true;
      return false;
    },
    { message: "画像サイズは2MB以下にしてください" }
  )
});

export type PostFormData = z.infer<typeof postSchema>;
