"use client"
import dynamic from 'next/dynamic';

export const Picker = dynamic(
    () => {
        return import('emoji-picker-react');
    },
    { ssr: false }
);

