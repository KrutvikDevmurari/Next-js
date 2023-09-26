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
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

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
        const messageHandler = (message: Message) => {
            console.log(`chat: ${chatId}`, "chat:${chatId}")
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
                            src={chatPartner.image}
                            alt={`${chatPartner.name} profile picture`}
                            className='rounded-full ml-2'
                        />
                    </div>
                </div>

                <div className='flex flex-col leading-tight'>
                    <div className='text-xl flex items-center'>
                        <span className='text-gray-700 mr-3 font-semibold'>
                            {chatPartner.name}
                        </span>
                    </div>

                    {/* <span className='text-sm text-gray-600'>{chatPartner.email}</span> */}
                    {typing && <span className='text-sm text-gray-600'>typing...</span>}
                </div>
            </div>
        </div>
        <Messages
            chatPartner={chatPartner}
            sessionImg={session.user.image}
            sessionId={session.user.id}
            messages={messages}
        />
        <ChatInput chatId={chatId} setInput={setInput} textareaRef={textareaRef} chatPartner={chatPartner} setTyping={setTyping} sendMessage={sendMessage} input={input} isLoading={isLoading} />

    </div>






}

export default ChatMain