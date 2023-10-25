'use client'
import React, { FC, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';

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
                                        className={`px-4 py-2 rounded-lg inline-block ${isCurrentUser ? 'bg-green-50 text-green-900' : 'bg-white text-gray-900'
                                            } ${!hasNextMessageFromSameUser && isCurrentUser ? 'rounded-br-none' : ''} ${!hasNextMessageFromSameUser && !isCurrentUser ? 'rounded-bl-none' : ''
                                            }`}>
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
                                    src={isCurrentUser ? (sessionImg as string) : chatPartnerDetail?.image}
                                    alt="Profile picture"
                                    referrerPolicy="no-referrer"
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GroupMessage;
