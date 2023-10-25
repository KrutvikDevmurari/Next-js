'use client'
import { FC, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Messages from '../Messages'
import ChatInput from '../ChatInput'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import toast from 'react-hot-toast'
import GroupMessage from '../GroupMessage'
import Link from 'next/link'


interface ChatHeaderProps {
    chatPartner: any,
    chatId: string,
    session: any,
    initialMessages: any,
    chatpartnerDetail: any
}

const GroupChatMain: FC<ChatHeaderProps> = ({ chatPartner, chatId, session, initialMessages, chatpartnerDetail }) => {
    const [typing, setTyping] = useState<boolean>(false)
    const [messages, setMessages] = useState<any[]>(initialMessages)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [isChatPartner, setIsChatPartner] = useState<any>([])
    const chatPartnerHandler = (res: any) => {
        const partnerData = chatpartnerDetail.find((response: any) => response._id === res.data);
        setIsChatPartner((prev: any) => {
            if (!(prev?.find((data: any) => data._id === res.data))) {
                return [...prev, partnerData];
            }
            return prev;
        });
        setTimeout(() => {
            setIsChatPartner((prev: any) => {
                console.log(prev.filter((item: any) => item._id !== res.data), "awer")
                return prev.filter((item: any) => item._id !== res.data)
            });
        }, 5000);
    };
    console.log(isChatPartner, "isChatPartner")
    const sendMessage = async () => {
        if (!input) return
        setIsLoading(true)

        try {
            await axios.post('/api/message/send', { text: input, chatId })
            setInput('')
            textareaRef.current?.focus()
        } catch {
            toast.error('Something went wrong. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(`chat:${chatId}`)
        )
        const messageHandler = (message: any) => {
            if (message) {
                setMessages((prev) => prev ? [message, ...prev] : [message])
            }
        }

        pusherClient.bind('incoming-message', messageHandler)

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`chat: ${chatId}`)
            )
            pusherClient.unbind('incoming-message', messageHandler)
        }
    }, [chatId, sendMessage])
    return <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
        <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200 bg-gray-200'>
            <div className='relative flex items-center space-x-4'>
                <div className='relative'>
                    <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
                        <Image
                            fill
                            referrerPolicy='no-referrer'
                            src={chatPartner?.groupImage.includes("http") ? chatPartner?.groupImage : `/uploads/group/${chatPartner?.groupImage}`}
                            alt={`${chatPartner?.groupname} profile picture`}
                            className='rounded-full ml-2'
                        />
                    </div>
                </div>

                <div className='flex flex-col leading-tight'>
                    <div className='text-xl flex items-center'>
                        <Link href={`/dashboard/group/update/${chatPartner._id}`} className='text-gray-700 mr-3 font-semibold'>
                            {chatPartner?.groupname}
                        </Link>
                    </div>

                    {/* <span className='text-sm text-gray-600'>{chatPartner.email}</span> */}
                    {typing && <span className='text-md text-gray-600'> {isChatPartner.map((resp: any, id: number) => {
                        return <span key={id}>{isChatPartner.length < 3 ? (resp.name) + (isChatPartner.length > 1 ? "," : "") : (isChatPartner.length) + "people"}</span>
                    })} typing <div className="rounded-lg inline-flex">
                            <div className="flex items-center typing">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-typing-dot"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-typing-dot"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dot"></div>
                            </div>
                        </div></span>}
                </div>
            </div>
        </div>
        <GroupMessage
            chatpartnerDetail={chatpartnerDetail}
            sessionImg={session.user.image}
            sessionId={session.user.id}
            messages={messages}
        />
        <ChatInput chatId={chatId} setInput={setInput} textareaRef={textareaRef} chatPartner={chatPartner} setTyping={setTyping} sendMessage={sendMessage} input={input} isLoading={isLoading} session={session} chatPartnerHandler={chatPartnerHandler} />

    </div>






}

export default GroupChatMain