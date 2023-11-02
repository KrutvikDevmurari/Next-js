'use client'

import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Download } from 'lucide-react'
import Image from 'next/image'
import { FC, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useRef, useState } from 'react'
import { ImagePreviewModal } from './ImagePreviewModal'
import ReactPlayer from 'react-player'
import axios from 'axios'

interface MessagesProps {
  sessionId: string
  sessionImg: string | null | undefined
  chatPartner: User,
  messages: any
}

const Messages: FC<MessagesProps> = ({
  sessionId,
  chatPartner,
  messages,
  sessionImg,
}) => {



  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>('');
  const openModal = (image: any) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedImage('');
    setModalIsOpen(false);
  };

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm')
  }

  return (
    <div
      id='messages'
      className='flex h-full flex-1 relative flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollin0g-touch bg-[url("/whatsapp.png")]'>
      <div ref={scrollDownRef} />

      {messages?.map((message: { senderId: string; id: any; timestamp: number; text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined, attachment: any[] }, index: number) => {
        const isCurrentUser = message.senderId === sessionId

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId

        return (
          <div
            className='chat-message'
            key={`${message.id} - ${message.timestamp}`}>
            <div
              className={cn('flex items-end', {
                'justify-end': isCurrentUser,
              })}>
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2',
                  {
                    'order-1 items-end': isCurrentUser,
                    'order-2 items-start': !isCurrentUser,
                  }
                )}>
                <span
                  className={cn('px-2 pt-3 rounded-lg flex items-end flex-col', {
                    'bg-green-50 text-green-900': isCurrentUser,
                    'bg-white text-gray-900': !isCurrentUser,
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rounded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}>
                  <span>
                    {message.attachment !== null && message.attachment.map((res) => {
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
                  </span>
                  {message.text !== " " ? message.text : null} {' '}
                  <span className='ml-2 text-xs text-gray-400 align-bottom'>
                    {formatTimestamp(message.timestamp)}
                  </span>
                </span>

              </div>

              <div
                className={cn('relative w-6 h-6', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}>
                <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImg?.includes('http') ? sessionImg : `/ uploads / profiles / ${sessionImg}` || '') : (chatPartner.image?.includes('http') ? chatPartner.image : `/uploads/profiles/${chatPartner.image}` || '')
                  }
                  alt='Profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                />
              </div>
            </div>
          </div>
        )
      })}
      {modalIsOpen && (
        <ImagePreviewModal onClose={closeModal} imageUrl={selectedImage} />)}
    </div >
  )
}

export default Messages