'use client'
import React, { FC, useRef, useEffect, useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { ImagePreviewModal } from './ImagePreviewModal';
import { Download } from 'lucide-react';

interface MessagesProps {
    sessionId: string;
    chatPartnerId?: string; // Updated to store the chat partner's ID
    messages: any[];
    sessionImg: string | null | undefined;
    chatpartnerDetail: any[];
}

const GroupMessage: FC<MessagesProps> = ({
    sessionId,
    chatPartnerId,
    messages,
    sessionImg,
    chatpartnerDetail,
}) => {
    const scrollDownRef = useRef<HTMLDivElement | null>(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = (image: any) => {
        setSelectedImage(image);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedImage('');
        setModalIsOpen(false);
    };
    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, 'HH:mm');
    };

    return (
        <div
            id="messages"
            className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-[url('/whatsapp.png')]">
            <div ref={scrollDownRef} />

            {messages?.map((message, index) => {
                const isCurrentUser = message.senderId === sessionId;
                const chatPartnerDetail = chatpartnerDetail.find((user) => user._id === message.senderId);

                const hasNextMessageFromSameUser = messages[index - 1]?.senderId === message.senderId;

                return (
                    <div className="chat-message" key={`${message.id} - ${message.timestamp}`}>
                        <div className={isCurrentUser ? 'flex items-end justify-end' : 'flex items-end'}>
                            <div className={isCurrentUser ? 'order-1 items-end' : 'order-2 items-start'}>
                                <div className="flex flex-col space-y-2 text-base max-w-xs mx-2">
                                    <span
                                        className={`px-4 flex flex-col py-2 rounded-lg inline-block ${isCurrentUser ? 'bg-green-50 text-green-900' : 'bg-white text-gray-900'
                                            } ${!hasNextMessageFromSameUser && isCurrentUser ? 'rounded-br-none' : ''} ${!hasNextMessageFromSameUser && !isCurrentUser ? 'rounded-bl-none' : ''
                                            }`}>
                                        {message.attachment !== null && message.attachment.map((res: any) => {
                                            console.log(res, "ressss")
                                            if (res.name?.includes("mp3")) {
                                                return (
                                                    <span key={res._id} onClick={() => openModal(res.name?.includes("http") ? res.name : `/uploads/chat/${res.name}`)}>
                                                        <audio controls src={res.name?.includes("http") ? res.name : `/uploads/chat/${res.name}`}>
                                                            Your browser does not support the audio element.
                                                        </audio>
                                                    </span>
                                                );
                                            } else if (res.name && (res.name.includes("mp4"))) {
                                                return (
                                                    <video width={"400"} controls>
                                                        <source src={res.name?.includes("http") ? res.name : `/uploads/chat/${res.name}`} type="audio/mp3" />
                                                        Your browser does not support HTML video.
                                                    </video>
                                                );
                                            }
                                            else if (res.name && (res.name.includes("http"))) {
                                                return (
                                                    <span key={res._id} onClick={() => openModal(res.name?.includes("http") ? res.name : `/uploads/chat/${res.name}`)}>
                                                        <img className='inline-block' src={`${res.name}`} width={200} height={200} alt={''} />
                                                    </span>
                                                );
                                            } else if (res.name && (res.name.includes("gif") || res.name.includes("jpg") || res.name.includes("png"))) {
                                                return (
                                                    <span key={res._id} onClick={() => openModal(res.name?.includes("http") ? res.name : `/uploads/chat/${res.name}`)}>
                                                        <Image className='inline-block' priority={false} src={`/uploads/chat/${res.name}`} width={200} height={200} alt={''} />
                                                    </span>
                                                );
                                            } else if (res.name?.includes('pdf')) {
                                                return (
                                                    <span key={res._id} className='flex justify-center items-center'>
                                                        <Image src={"/pdf.png"} alt="" height={50} width={50} className='mr-2' />
                                                        {res.name}
                                                        <a className='ml-2' target="_blank" href={`/uploads/chat/${res.name}`}><Download /></a>
                                                    </span>
                                                )
                                            } else if (res.name?.includes('doc')) {
                                                return (
                                                    <span key={res._id} className='flex justify-center items-center'>
                                                        <Image src={"/word.png"} alt="" height={50} width={50} className='mr-2' />
                                                        {res.name}
                                                        <a className='ml-2' target="_blank" href={`/uploads/chat/${res.name}`}><Download /></a>
                                                    </span>
                                                )
                                            } else if (res.name?.includes('xls')) {
                                                return (
                                                    <span key={res._id} className='flex justify-center items-center'>
                                                        <Image src={"/xls.png"} alt="" height={50} width={50} className='mr-2' />
                                                        {res.name}
                                                        <a className='ml-2' target="_blank" href={`/uploads/chat/${res.name}`}><Download /></a>
                                                    </span>
                                                )
                                            } else {
                                                return (
                                                    <span key={res._id} className='flex justify-center items-center'>
                                                        <Image src={"/doc.png"} alt="" height={50} width={50} className='mr-2' />
                                                        {res.name}
                                                        <a className='ml-2' target="_blank" href={`/uploads/chat/${res.name}`}><Download /></a>
                                                    </span>
                                                )
                                            }
                                        })}
                                        {message.text}{' '}
                                        <span className="ml-2 text-xs text-gray-400">
                                            {formatTimestamp(message.timestamp)}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`relative w-6 h-6 ${isCurrentUser ? 'order-2' : 'order-1'} ${hasNextMessageFromSameUser ? 'invisible' : ''
                                    }`}>
                                <Image
                                    fill
                                    src={
                                        isCurrentUser ? (sessionImg?.includes('http') ? sessionImg : `/uploads/profiles/${sessionImg}` || '') : (chatPartnerDetail.image?.includes('http') ? chatPartnerDetail.image : `/uploads/profiles/${chatPartnerDetail.image}` || '')
                                    }
                                    alt="Profile picture"
                                    referrerPolicy="no-referrer"
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
            {modalIsOpen && (
                <ImagePreviewModal onClose={closeModal} imageUrl={selectedImage} />)}
        </div>
    );
};

export default GroupMessage;
