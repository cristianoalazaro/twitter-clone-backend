import { z } from "zod"

export const FeedSchema = z.object({
    page: z.coerce.number().default(1),
});