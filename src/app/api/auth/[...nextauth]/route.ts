import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth/next'

const hanlder = NextAuth(authOptions);
export { hanlder as POST, hanlder as GET }