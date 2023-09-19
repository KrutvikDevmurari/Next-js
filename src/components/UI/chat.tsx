

'use client'
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, SetStateAction, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const Chat: React.FC = () => {
    const [input, setInput] = useState('')

    useEffect(() => {
        socketInitializer()
    }, [])

    const socketInitializer = async () => {
        await fetch('/api/socket');
        socket = io()

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on('update-input', msg => {
            setInput(msg)
        })
    }

    const onChangeHandler = (e: { target: { value: SetStateAction<string>; }; }) => {
        setInput(e.target.value)
        socket.emit('input-change', e.target.value)
    }

    return (
        <input
            placeholder="Type something"
            value={input}
            onChange={onChangeHandler}
        />
    )
};

export default Chat;