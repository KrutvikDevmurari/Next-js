"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import SignOutButton from '@/components/UI/SignOutButton'
import axios from 'axios'
import { pusherClient } from '@/lib/pusher'

const UserProfileSidebar = ({ session }: any) => {
    const router = useRouter()
    const [sessionData, setsessionData] = useState<any>(session)
    const userDataHandler = () => {
        axios.get('/api/user/data').then(res => {
            setsessionData(res.data.data)
        })
    }
    useEffect(() => {
        pusherClient.subscribe('userSessionChannel')
        pusherClient.bind('userSessionData', userDataHandler)

        return () => {
            pusherClient.unsubscribe('userSessionChannel')
            pusherClient.unbind('userSessionData', userDataHandler)
        }
    }, [])
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
                        src={sessionData.user.image.includes("http") ? sessionData.user.image : `/uploads/profiles/${sessionData.user.image}` || ''}
                        alt='Your profile picture'
                    />
                </div>

                <span className='sr-only'>Your profile</span>
                <div className='flex flex-col'>
                    <span aria-hidden='true' className='truncate max-w-[100px]'>{sessionData.user.name}</span>
                    <span className='text-xs text-zinc-400 truncate max-w-[100px]' aria-hidden='true'>
                        {sessionData.user.email}
                    </span>
                </div>
            </div>

            <SignOutButton className='h-full aspect-square' />
        </li>
    )
}

export default UserProfileSidebar