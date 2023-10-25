import { chatHrefConstructor, cn } from '@/lib/utils'
import Image from 'next/image'
import { FC } from 'react'
import { toast, type Toast } from 'react-hot-toast'
import Link from 'next/link'

interface UnseenChatToastProps {
    t: Toast
    senderImg: string
    senderName: string
    senderMessage: string,
    chatId: string,
    activeChats: any
}

const UnseenGroupChatToast: FC<UnseenChatToastProps> = ({
    t,
    senderImg,
    senderName,
    senderMessage,
    chatId,
    activeChats
}) => {
    return (
        <div
            className={cn(
                'max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5',
                { 'animate-enter': t.visible, 'animate-leave': !t.visible }
            )}>
            <Link
                onClick={() => toast.dismiss(t.id)}
                href={`/dashboard/group/chat/${chatId}`}
                className='flex-1 w-0 p-4'>
                <div className='flex items-start'>
                    <div className='flex-shrink-0 pt-0.5'>
                        <div className='relative h-10 w-10'>
                            <Image
                                fill
                                referrerPolicy='no-referrer'
                                className='rounded-full'
                                src={activeChats?.groupImage?.includes("http") ? activeChats?.groupImage : `/uploads/group/${activeChats?.groupImage}`}
                                alt={`${senderName} profile picture`}
                            />
                        </div>
                    </div>
                    <div className='ml-3 flex-1'>
                        <p className='mt-1 font-bold text-md '>{activeChats?.groupname}</p>
                        <div className='flex gap-2 items-center'> <Image
                            width={20}
                            height={10}
                            referrerPolicy='no-referrer'
                            className='rounded-full'
                            src={senderImg?.includes("http") ? senderImg : `/uploads/profiles/${senderImg}`}
                            alt={`${senderName} profile picture`}
                        /> <p className='mt-1 text-sm'>{senderName}</p></div>
                        <p className='mt-1 text-sm text-gray-500'>{senderMessage}</p>
                    </div>
                </div>
            </Link>

            <div className='flex border-l border-gray-200'>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
                    Close
                </button>
            </div>
        </div>
    )
}

export default UnseenGroupChatToast