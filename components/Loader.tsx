import React from 'react';

interface LoaderProps {
    message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center mt-8 p-4">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-yellow-400">{message}</p>
        </div>
    );
};
