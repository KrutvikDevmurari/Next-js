'use client'

import { Loader2, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { ButtonHTMLAttributes, FC, useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from './Button'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation';

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { }

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false)
    const router = useRouter()
    return (
        <Button
            {...props}
            variant='ghost'
            onClick={async () => {
                setIsSigningOut(true)
                try {
                    router.push("/")
                    await signOut({ redirect: false, callbackUrl: 'http://localhost:3000/' })
                    redirect('/signout')
                } catch (error) {
                    // toast.error('There was a problem signing out')
                } finally {
                    setIsSigningOut(false)
                }
            }}>
            {isSigningOut ? (
                <Loader2 className='animate-spin h-4 w-4' />
            ) : (
                <LogOut className='w-4 h-4' />
            )}
        </Button>
    )
}

export default SignOutButton