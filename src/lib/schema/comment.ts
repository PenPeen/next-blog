import { z } from "zod";

export const COMMENT_MAX_LENGTH = 255;

export const commentSchema = z.object({
  content: z.string()
    .min(1, { message: "コメント内容を入力してください" })
    .max(COMMENT_MAX_LENGTH, { message: `コメントは${COMMENT_MAX_LENGTH}文字以内で入力してください` })
});

export type CommentFormData = z.infer<typeof commentSchema>;
