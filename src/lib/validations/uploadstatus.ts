import { z } from 'zod'

export const uploadStatusValidor = z.object({
    status: z.string(),
})

