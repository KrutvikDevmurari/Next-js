'use client'
import { FC, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Button from '../components/UI/Button'
import { Icons } from './UI/Icons'
import { pusherClient } from '@/lib/pusher'
import { GiftIcon, Paperclip, Smile, Upload, XCircle } from 'lucide-react'
import { toPusherKey } from '@/lib/utils'
import { Picker } from './Picker'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Grid } from '@giphy/react-components'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder'
import { v4 as uuidv4 } from 'uuid';

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
    chatPartnerHandler: any,
    setAttachment: any,
    setFileOpen: any
    fileOpen: any,
    attachment: any
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, setAttachment, attachment, fileOpen, setFileOpen, chatId, setTyping, input, sendMessage, isLoading, textareaRef, setInput, session, chatPartnerHandler }) => {
    const [userId1, userId2] = chatId.split('--')
    const chatPartnerId = session.user.id === userId1 ? userId2 : userId1
    const channel: any = pusherClient.subscribe(toPusherKey(`private-chat:${chatId}`));
    const cancelButtonRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [gifopen, setGifOpen] = useState(false)
    // use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
    const gf = new GiphyFetch('MzLqtuTQf5PUOUj5W9D2f9dPJ9BNYNRu')

    // configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
    const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })
    useEffect(() => {
        channel.bind("pusher:subscription_succeeded", (members: any) => {
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
            setOpen(false);
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

    const recorderControls = useAudioRecorder()
    const addAudioElement = async (blob: any) => {
        const audioBlob = new File([blob], `${uuidv4()}.mp3`, { type: blob.type });
        setAttachment(audioBlob)
    };
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
                <div className={`${gifopen ? "block" : "hidden"} bg-white p-2 rounded-md  absolute overflow-auto h-56 flex justify-center cursor-pointer`} style={{ bottom: '100%', right: "8%" }}> <Grid onGifClick={(e) => {
                    setAttachment(e.images.original.url)
                    !isLoading && sendMessage(e.images.original.url)
                    setGifOpen(!gifopen)
                }} width={800} columns={3} fetchGifs={fetchGifs} noLink={true} hideAttribution={true} /></div>
                <div
                    className={`${fileOpen ? "block" : "hidden"} absolute mt-2 w-52 bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5`}
                    style={{ bottom: '100%', right: "8%" }}
                >
                    <div className='bg-blue-100 w-full p-5 rounded-lg shadow-md'>
                        <div className='mb-4'>
                            <label className='block text-lg font-semibold text-gray-800 mb-2'>File Upload</label>
                            <label className='w-full flex items-center px-4 py-2 bg-white text-blue-500 rounded cursor-pointer border border-blue-500'>
                                <Upload />
                                Upload File
                                <input
                                    type='file'
                                    className='hidden'
                                    onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                                />
                            </label>
                        </div>
                    </div>

                </div>
                <div className={`${(attachment !== "" && attachment?.name) ? "block" : "hidden"} absolute bg-blue-100 p-2 pl-4 flex w-48 rounded-md shadow-md ring-1 ring-blue-500 ring-opacity-50 justify-between items-center`} style={{ bottom: '100%' }}>
                    <div className='max-w-md overflow-hidden text-blue-800'>
                        {attachment && attachment.name}
                    </div>
                    <XCircle className='cursor-pointer text-red-600' onClick={() => setAttachment("")} height={24} width={24} />
                </div>
                <div className='border-t border-gray-200 bg-gray-200 mb-2 sm:mb-0 py-2 pl-3 pr-2 w-full flex justify-between  items-center '>
                    <Smile className='mr-1 cursor-pointer text-indigo-600' onClick={() => toggleModal()} ref={cancelButtonRef} />
                    <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 h-30 bg-white' style={{ borderRadius: '21px', height: '47px' }}>
                        <TextareaAutosize
                            ref={textareaRef}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    if (!isLoading) {
                                        sendMessage(attachment)
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
                                <Paperclip className='text-indigo-600 absolute right-5 top-3 cursor-pointer z-10' width={20} height={20} onClick={() => setFileOpen(!fileOpen)} />
                            </div>
                        </div>
                        <div
                            onClick={() => textareaRef.current?.focus()}
                            className='py-2'
                            aria-hidden='true'>
                            <div className='py-px'>
                                <GiftIcon className='text-indigo-600 absolute right-12 top-3 cursor-pointer z-10' width={20} height={20} onClick={() => setGifOpen(!gifopen)} />
                            </div>
                        </div>
                        <div
                            onClick={() => textareaRef.current?.focus()}
                            className='py-2'
                            aria-hidden='true'>
                            <div className='py-px'>
                                <AudioRecorder
                                    classes={{ AudioRecorderClass: 'text-indigo-600 absolute right-20 top-1 cursor-pointer z-10 w-10 h-10 microphone' }}
                                    onRecordingComplete={addAudioElement}
                                    recorderControls={recorderControls}
                                />
                            </div>
                        </div>

                    </div>
                    <div className=''>
                        <div className='flex-shrin-0'>
                            <Button isLoading={isLoading} className='rounded-full p-2 bg-gray-200 hover:bg-gray-200' style={{ width: '42px', height: '38px' }} onClick={() => sendMessage(attachment)} type='submit'>
                                {isLoading ? "" : <Icons.Logo className='h-8 w-auto text-indigo-600' />}
                            </Button>
                        </div>
                    </div>
                </div>

            </div >
        </>
    )
}

export default ChatInput