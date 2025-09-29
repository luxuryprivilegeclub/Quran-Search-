import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface InputFormProps {
    query: string;
    setQuery: (query: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ query, setQuery, onSubmit, isLoading }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='e.g., "Al-Baqarah 255" or "2:255"'
                    className="w-full bg-gray-700 border-2 border-gray-600 rounded-md py-3 pl-4 pr-10 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    disabled={isLoading}
                    aria-label="Surah and Ayah"
                />
                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>

            <div className="flex items-center w-full sm:w-auto">
                <button
                    type="submit"
                    className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center"
                    disabled={isLoading}
                >
                    Fetch
                </button>
            </div>
        </form>
    );
};