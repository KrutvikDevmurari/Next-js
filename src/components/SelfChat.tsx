'use client'

import { chatHrefConstructor } from '@/lib/utils'
import { FC, useEffect, useState, } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { pusherClient } from '@/lib/pusher'
import Link from 'next/link'

interface SidebarChatListProps {
    friends: any[] | null
    session: any,
}

const SelfChat: FC<SidebarChatListProps> = ({ friends, session }: any) => {
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

    const sessionId = sessionData.user.id
    return (
        <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
            <>
                <li>
                    <div

                        className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold justify-between cursor-pointer'>
                        <Link className='group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold' href={`/dashboard/chat/${chatHrefConstructor(
                            sessionId,
                            sessionId
                        )}`}>

                            <Image src={sessionData.user.image?.includes("http") ? sessionData.user.image : `/uploads/profiles/${sessionData.user.image}`} alt="Friend Zone" width={25} height={25} className='rounded-full' />{sessionData.user.name}

                        </Link>
                    </div>
                </li>
            </>
        </ul>
    )
}

export default SelfChat