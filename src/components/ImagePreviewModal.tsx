import React, { useState } from 'react';
import Image from 'next/image'

export function ImagePreviewModal({ imageUrl, onClose }: any) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-70" onClick={onClose}></div>
            <div className="bg-white rounded-lg max-w-md z-10 relative">
                {imageUrl?.includes('http') ? <img src={imageUrl} alt="Preview" loading='eager' width={600} height={600} /> : <Image src={imageUrl} alt="Preview" loading='eager' width={600} height={600} />}
            </div>
        </div>
    );
}

