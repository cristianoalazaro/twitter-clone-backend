import { string, z } from "zod"

export const UpdateUserSchema = z.object({
    name: z.string({ message: 'Nome é obrigatório' }).min(2, 'Precisa ter 2 ou mais caracteres'),
    bio: string().optional(),
    link: string().url('Precisa ser uma URL válida').optional(),
})