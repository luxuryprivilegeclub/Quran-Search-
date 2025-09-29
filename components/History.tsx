import React from 'react';
import { ClockIcon } from './icons/ClockIcon';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryProps {
    items: string[];
    onItemClick: (item: string) => void;
    onClear: () => void;
    isLoading: boolean;
}

export const History: React.FC<HistoryProps> = ({ items, onItemClick, onClear, isLoading }) => {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 w-full max-w-4xl animate-fade-in" role="region" aria-labelledby="history-heading">
            <div className="flex justify-between items-center mb-3">
                <h2 id="history-heading" className="text-lg font-semibold text-gray-400 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2" />
                    Recent Searches
                </h2>
                <button
                    onClick={onClear}
                    disabled={isLoading}
                    className="text-sm text-gray-500 hover:text-red-400 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Clear history"
                >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Clear
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <button
                        key={item}
                        onClick={() => onItemClick(item)}
                        disabled={isLoading}
                        className="bg-gray-700/80 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Add a simple fade-in animation for when the history appears
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
`;
document.head.appendChild(style);
