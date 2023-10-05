"use client"
import React from 'react'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import SignOutButton from '@/components/UI/SignOutButton'

const UserProfileSidebar = ({ session }: any) => {
    const router = useRouter()
    return (
        <li className='-mx-6 mt-auto flex items-center cursor-pointer'>
            <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900' onClick={() => {
                router.push('/dashboard/user/update')
            }}>
                <div className='relative h-8 w-8 bg-gray-50'>
                    <Image
                        fill
                        referrerPolicy='no-referrer'
                        className='rounded-full'
                        src={session.user.image.includes("http") ? session.user.image : `/uploads/profiles/${session.user.image}` || ''}
                        alt='Your profile picture'
                    />
                </div>

                <span className='sr-only'>Your profile</span>
                <div className='flex flex-col'>
                    <span aria-hidden='true' className='truncate max-w-[100px]'>{session.user.name}</span>
                    <span className='text-xs text-zinc-400 truncate max-w-[100px]' aria-hidden='true'>
                        {session.user.email}
                    </span>
                </div>
            </div>

            <SignOutButton className='h-full aspect-square' />
        </li>
    )
}

export default UserProfileSidebar