import { z } from "zod";

export const CreateAttachment = z.object({
  fileName: z.string(),
  fileType: z.string(),
});

export type CreateAttachmentType = z.infer<typeof CreateAttachment>;
