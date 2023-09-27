'use client'

import axios from 'axios'
import { FC, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'
import Button from '../components/UI/Button'
import { Icons } from './UI/Icons'
import { toPusherKey } from '@/lib/utils'
import { pusherClient } from '@/lib/pusher'

interface ChatInputProps {
    chatPartner: User
    chatId: string,
    setTyping: any,
    sendMessage: any,
    input?: any,
    isLoading: boolean,
    textareaRef: any,
    setInput?: any,
    session: any
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId, setTyping, input, sendMessage, isLoading, textareaRef, setInput, session }) => {
    const [userId1, userId2] = chatId.split('--')
    const chatPartnerId = session.user.id === userId1 ? userId2 : userId1
    useEffect(() => {
        // Listen for typing events from Pusher
        const channel = pusherClient.subscribe("typing-channel");

        pusherClient.bind("pusher:subscription_succeeded", () => {
            console.log("sucess")
            var triggered = channel.trigger("typing", {
                your: "data",
            });
            console.log("triggered", triggered);
        });

        pusherClient.bind("typing", (data: any) => {
            const { typing } = data;
            setTyping(typing); // Set setTyping to true when typing starts
        });

        return () => {
            // Unsubscribe from the channel when the component unmounts
            pusherClient.unbind();
        };
    }, [input]);


    return (
        <div>
            <div className='border-t border-gray-200 bg-gray-200 mb-2 sm:mb-0 py-2 pl-3 pr-2 w-full flex justify-between  items-center '>
                <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 h-30 bg-white' style={{ borderRadius: '21px', height: '42px' }}>
                    <TextareaAutosize
                        ref={textareaRef}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                if (!isLoading) {
                                    sendMessage()
                                }
                            }
                        }}
                        rows={1}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value)
                        }}
                        placeholder={`Message ${chatPartner.name}`}
                        className='block w-full resize-none border-0 bg-transparent text-gray-900 pl-6 pt-2 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
                    />

                    <div
                        onClick={() => textareaRef.current?.focus()}
                        className='py-2'
                        aria-hidden='true'>
                        <div className='py-px'>
                            <div className='' />
                        </div>
                    </div>

                </div>
                <div className=''>
                    <div className='flex-shrin-0'>
                        <Button isLoading={isLoading} className='rounded-full p-2 bg-gray-200 hover:bg-gray-200' style={{ width: '42px', height: '38px' }} onClick={sendMessage} type='submit'>
                            {isLoading ? "" : <Icons.Logo className='h-8 w-auto text-indigo-600' />}
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ChatInput