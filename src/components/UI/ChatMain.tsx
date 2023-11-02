'use client'
import { FC, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Messages from '../Messages'
import ChatInput from '../ChatInput'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import toast from 'react-hot-toast'

interface ChatHeaderProps {
    chatPartner: any,
    chatId: string,
    session: any,
    initialMessages: any,
}

const ChatMain: FC<ChatHeaderProps> = ({ chatPartner, chatId, session, initialMessages }) => {
    const [typing, setTyping] = useState<boolean>(false)
    const [isChatPartner, setIsChatPartner] = useState<any>()
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')
    const [attachment, setAttachment] = useState<any>('')
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [fileOpen, setFileOpen] = useState(false)
    const sendMessage = async (attachments: any) => {
        if (!input && (attachments === undefined || attachments === "")) return
        setIsLoading(true)
        const formDatatosend = new FormData();
        formDatatosend.append("text", input);
        formDatatosend.append("chatId", chatId);
        formDatatosend.append("attachment", attachments);
        try {
            await axios.post('/api/message/send', formDatatosend)
            setInput('')
            setAttachment("")
            textareaRef.current?.focus()
        } catch {
            toast.error('Something went wrong. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const handleDocumentClick = () => {
            setFileOpen(false);
        };

        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
            // Unsubscribe from the channel when the component unmounts
            pusherClient.unbind('client-typing', (data: any) => {
                const { typing } = data;
                setTyping(false);
            });
        };
    }, [fileOpen]);

    const chatPartnerHandler = (res: any) => {
        setIsChatPartner(res)
    }

    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(`chat:${chatId}`)
        )
        const messageHandler = (message: Message) => {
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

    return <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)] modalClass'>
        <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200 bg-gray-200'>
            <div className='relative flex items-center space-x-4'>
                <div className='relative'>
                    <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
                        <Image
                            fill
                            referrerPolicy='no-referrer'
                            src={chatPartner?.image.includes("http") ? chatPartner?.image : `/uploads/profiles/${chatPartner?.image}`}
                            alt={`${chatPartner?.name} profile picture`}
                            className='rounded-full ml-2'
                        />
                    </div>
                </div>

                <div className='flex flex-col leading-tight'>
                    <div className='text-xl flex items-center'>
                        <span className='text-gray-700 mr-3 font-semibold'>
                            {chatPartner?.name}
                        </span>
                    </div>

                    {/* <span className='text-sm text-gray-600'>{chatPartner.email}</span> */}
                    {typing && <span className='text-md text-gray-600'>typing<div className="rounded-lg inline-flex">
                        <div className="flex items-center typing">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-typing-dot"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-typing-dot"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dot"></div>
                        </div>
                    </div></span>}
                </div>
            </div>
        </div>
        <Messages
            chatPartner={chatPartner}
            sessionImg={session.user.image}
            sessionId={session.user.id}
            messages={messages}
        />
        <ChatInput chatId={chatId} attachment={attachment} setInput={setInput} textareaRef={textareaRef} chatPartner={chatPartner} setTyping={setTyping} sendMessage={sendMessage} input={input} fileOpen={fileOpen} setFileOpen={setFileOpen} setAttachment={setAttachment} isLoading={isLoading} session={session} chatPartnerHandler={chatPartnerHandler} />

    </div>






}

export default ChatMain