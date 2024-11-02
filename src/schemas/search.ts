import { z } from "zod"

export const SearchSchema = z.object({
    q: z.string({ message: 'Preencha a busca' }).min(3, 'Mínimo de 3 caracteres'),
    page: z.coerce.number().default(1),
})