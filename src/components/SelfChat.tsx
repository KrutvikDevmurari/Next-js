'use client'

import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import UnseenChatToast from './UnseenChatToast'
import { signIn } from 'next-auth/react'

interface SidebarChatListProps {
    friends: any[] | null
    session: any,
}

interface ExtendedMessage extends Message {
    senderImg: string
    senderName: string,
    chatId: string
}

const SelfChat: FC<SidebarChatListProps> = ({ friends, session }: any) => {
    const sessionId = session.user.id
    return (
        <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
            <>
                <li>
                    <div

                        className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold justify-between cursor-pointer'>
                        <a className='group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold' href={`/dashboard/chat/${chatHrefConstructor(
                            sessionId,
                            sessionId
                        )}`}>

                            <Image src={session.user.image?.includes("http") ? session.user.image : `/uploads/profiles/${session.user.image}`} alt="Friend Zone" width={25} height={25} className='rounded-full' />{session.user.name}

                        </a>
                    </div>
                </li>
            </>
        </ul>
    )
}

export default SelfChat