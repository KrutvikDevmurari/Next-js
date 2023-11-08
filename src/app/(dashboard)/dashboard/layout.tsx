import { Icon, Icons } from '@/components/UI/Icons'

import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'
import { getUserfromSession } from '@/helpers/usermodel'
import { SidebarOption } from '@/types/typings'
import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOption'
import SidebarChatList from '@/components/SideBarChatList'
import MobileChatLayout from '@/components/MobileChatLayout'
import UserProfileSidebar from '@/components/userProfileSidebar'
import SidebarGroupChatList from '@/components/SideBarGroupChatList'
import SelfChat from '@/components/SelfChat'
import axios from 'axios'

interface LayoutProps {
    children: ReactNode
}

// Done after the video and optional: add page metadata
export const metadata = {
    title: 'FriendZone | Dashboard',
    description: 'Your dashboard',
}

const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus',
    },
    {
        id: 2,
        name: 'Create Group',
        href: '/dashboard/group',
        Icon: 'Users',
    },
    {
        id: 2,
        name: 'Status',
        href: '/dashboard/status',
        Icon: 'CircleDashed',
    },
]
const sidebarOptions2 = JSON.parse(JSON.stringify(sidebarOptions))

const Layout = async ({ children }: LayoutProps) => {
    const session = await getServerSession(authOptions)
    if (!session) {
        notFound()
    }
    if (session.expires) {
        await axios.post('api/user/offline')
        notFound()
    }

    // const friends: User[] = [] // Assuming User is the type of user objects

    const friend: any = await getUserfromSession(session)
    const group: any = session.user.group
    const friends = JSON.parse(friend)
    const unseenRequestCount = JSON.parse(JSON.stringify(session.user.requests?.length))
    const sessionId = JSON.parse(JSON.stringify(session.user.id))
    const image = '/logomain.png'
    return (
        <div className='w-full flex h-screen container  px-16 py-12 '>
            <div className='md:hidden'>
                <MobileChatLayout
                    friends={friends}
                    session={JSON.parse(JSON.stringify(session))}
                    sidebarOptions={sidebarOptions2}
                    unseenRequestCount={unseenRequestCount}
                />
            </div>

            <div className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
                <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
                    <Image src={image} alt="Friend Zone" width={100} height={100} />
                </Link>


                <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                        <li>
                            <div className='text-xs font-semibold leading-6 text-gray-400'>
                                Overview
                            </div>

                            <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {sidebarOptions.map((option) => {
                                    const Icon = Icons[option.Icon]
                                    return (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                                                <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                                                    <Icon className='h-4 w-4' />
                                                </span>

                                                <span className='truncate'>{option.name}</span>
                                            </Link>
                                        </li>
                                    )
                                })}

                                <li>
                                    <FriendRequestSidebarOptions
                                        sessionId={sessionId}
                                        initialUnseenRequestCount={unseenRequestCount}
                                    />
                                </li>
                            </ul>
                        </li>
                        <>
                            <div className='text-xs font-semibold leading-6 text-gray-400'>
                                Self Chat
                            </div>
                            <li>
                                <SelfChat session={JSON.parse(JSON.stringify(session))} friends={friends} />
                            </li>
                        </>

                        {friends !== null && (friends?.length > 0 ? (
                            <>
                                <div className='text-xs font-semibold leading-6 text-gray-400'>
                                    Your chats
                                </div>
                                <li>
                                    <SidebarChatList sessionId={session.user.id} friends={friends} />
                                </li>
                            </>
                        ) : null)}

                        {group !== null && (group?.length > 0 ? (
                            <>
                                <div className='text-xs font-semibold leading-6 text-gray-400'>
                                    Group chats
                                </div>
                                <li>
                                    <SidebarGroupChatList sessionId={session.user.id} friends={JSON.parse(JSON.stringify(group))} />
                                </li>
                            </>
                        ) : null)}

                        <UserProfileSidebar session={JSON.parse(JSON.stringify(session))} />
                    </ul>
                </nav>
            </div>

            <aside className='max-h-screen  w-full bg-gray-200 overflow-auto'>
                {children}
            </aside>
        </div>
    )
}

export default Layout