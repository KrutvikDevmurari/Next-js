'use client'
import { FC, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Button from '../components/UI/Button'
import { Icons } from './UI/Icons'
import { pusherClient } from '@/lib/pusher'
import { Paperclip, Smile } from 'lucide-react'
import { toPusherKey } from '@/lib/utils'
import { Picker } from './Picker'
import { Popover } from "@headlessui/react";

interface ChatInputProps {
    chatPartner: User
    chatId: string,
    setTyping: any,
    sendMessage: any,
    input?: any,
    isLoading: boolean,
    textareaRef: any,
    setInput?: any,
    session: any,
    chatPartnerHandler: any
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId, setTyping, input, sendMessage, isLoading, textareaRef, setInput, session, chatPartnerHandler }) => {
    const [userId1, userId2] = chatId.split('--')
    const chatPartnerId = session.user.id === userId1 ? userId2 : userId1
    const channel: any = pusherClient.subscribe(toPusherKey(`private-chat:${chatId}`));
    const cancelButtonRef = useRef(null)
    const [open, setOpen] = useState(false)
    useEffect(() => {
        channel.bind("pusher:subscription_succeeded", (members: any) => {
            console.log("sucess")
            // var me = channel.members.me;
            // var userId = me.id;
            // var userInfo = me.info;
        });
        var triggered = channel.trigger("client-typing", {
            data: session.user.id,
        });

        channel.bind("pusher:subscription_error", (error: any) => {
            var { status } = error;
            if (status == 408 || status == 503) {
                // Retry?
                console.log("error", error)
            }
            console.log("error", error)
        });

        pusherClient.bind("client-typing", (data: any) => {
            if (chatPartnerId !== session.user.id) {
                setTyping(true);
                chatPartnerHandler(data);
                setTimeout(() => {
                    setTyping(false)
                }, 5000);
            }
        });
        return () => {
            // Unsubscribe from the channel when the component unmounts
            pusherClient.unbind("client-typing", (data: any) => {
                const { typing } = data;
                setTyping(false);
            });
        };
    }, [input]);

    useEffect(() => {
        const handleDocumentClick = () => {
            if (open) {
                setOpen(false);
            }
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
    }, [open]);

    const toggleModal = () => {
        setOpen(!open)
    }

    return (
        <>

            <div className='relative'>
                <div
                    className={`${open ? "block" : "hidden"} absolute mt-2 w-48 bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5`}
                    style={{ bottom: '100%' }}
                >
                    <Picker searchDisabled={true} skinTonesDisabled={true} lazyLoadEmojis={true} onEmojiClick={(e: any) => {
                        const value = e.emoji
                        if (e.emoji) {
                            setInput((prev: any) => prev + value);
                        }
                    }} />
                </div>
                <div className='border-t border-gray-200 bg-gray-200 mb-2 sm:mb-0 py-2 pl-3 pr-2 w-full flex justify-between  items-center '>
                    <Smile className='mr-1 cursor-pointer text-indigo-600' onClick={() => toggleModal()} ref={cancelButtonRef} />
                    <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 h-30 bg-white' style={{ borderRadius: '21px', height: '42px' }}>
                        <TextareaAutosize
                            ref={textareaRef}
                            onKeyDown={(e) => {
                                if (input.length === 0 && e.key === " ") {
                                    e.preventDefault()
                                } else if (e.key === 'Enter' && !e.shiftKey) {
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
                            placeholder={chatPartner?.name !== undefined ? `Message ${chatPartner?.name}` : `Message in ${chatPartner?.groupname}`}
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
                        <Paperclip className='text-indigo-600 absolute right-5 top-3 cursor-pointer' width={20} height={20} />
                    </div>

                    <div className=''>
                        <div className='flex-shrin-0'>
                            <Button isLoading={isLoading} className='rounded-full p-2 bg-gray-200 hover:bg-gray-200' style={{ width: '42px', height: '38px' }} onClick={sendMessage} type='submit'>
                                {isLoading ? "" : <Icons.Logo className='h-8 w-auto text-indigo-600' />}
                            </Button>
                        </div>
                    </div>
                    {/* <EmojiModal cancelButtonRef={cancelButtonRef} toggleModal={toggleModal} open={open} childern={emojiPicker} /> */}
                </div>

            </div>
        </>
    )
}

export default ChatInput