import { z } from 'zod'

export const createGroupValidator = z.object({
    groupName: z.string(),
})


