import { z } from "zod";

export const commentSchema = z.object({
  content: z.string()
    .min(1, { message: "コメント内容を入力してください" })
    .max(255, { message: "コメントは255文字以内で入力してください" })
});

export type CommentFormData = z.infer<typeof commentSchema>;
