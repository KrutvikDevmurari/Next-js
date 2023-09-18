import type { Session } from 'next-auth'
import { User } from './db'
import type { JWT } from 'next-auth/jwt'

type UserId = string

declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId
    }
}

declare module 'next-auth' {
    interface Session {
        user: User & {
            id: UserId
        }
    }
}