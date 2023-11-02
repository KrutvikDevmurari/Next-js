import React from 'react';
import { format } from 'date-fns';

export function StatusPreviewModal({ text, timestamp, onClose }: any) {
    console.log(text, "text")
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-70" onClick={onClose}></div>
            <div className="ml-4 relative">
                <div className="w-full max-w-md relative group">
                    <div className="relative">
                        <div className="bg-blue-500 text-white p-8 rounded-lg">
                            <p className="font-bold text-3xl mt-4 mb-4">
                                {text}
                            </p>
                            <p className="text-gray-300">
                                Posted at {timestamp && format(timestamp, 'HH:mm')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

