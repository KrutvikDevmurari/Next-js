"use client"
import AddFriendButton from '@/components/UI/AddFriendButton'
import { pusherClient } from '@/lib/pusher';
import axios from 'axios';
import { FC, useEffect, useState } from 'react'

const Page: FC = () => {
    useEffect(() => {
        const val = pusherClient.signin();
        const online = axios.post('/api/user/online');
    }, [])

    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8 pl-4'>Add a friend</h1>
            <AddFriendButton />
        </main>
    )
}
export default Page