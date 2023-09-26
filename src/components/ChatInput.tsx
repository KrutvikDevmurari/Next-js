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
    input: any,
    isLoading: boolean,
    textareaRef: any,
    setInput: any
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId, setTyping, input, sendMessage, isLoading, textareaRef, setInput }) => {
    const [userId1, userId2] = chatId.split('--')


    useEffect(() => {
        // Extract user IDs from chatId

        // Subscribe to the Pusher channel for userId2 typing status
        const channel = pusherClient.subscribe(`typing:${userId2}`);
        const messageHandler = (message: any) => {
            console.log(`typing:${userId2}`)
            setTyping(true);

        };

        // Bind the event handler to the 'typing-message' event
        channel.bind('typing-message', messageHandler);


        // Function to send typing status to the channel
        channel.trigger('client-typing-message', '');


        return () => {
            // Unsubscribe from the Pusher channel
            channel.unbind('typing-message', messageHandler);
            channel.unsubscribe();

            // Set typing to false
            setTyping(false);
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
                        <Button isLoading={isLoading} className='rounded-full p-2' style={{ width: '42px', height: '38px' }} onClick={sendMessage} type='submit'>
                            {isLoading ? "" : <Icons.Logo className='h-10 w-auto text-white' />}
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ChatInput