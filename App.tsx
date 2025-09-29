import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { fetchQuranData, parseUserInput } from './services/quranService';
import { History } from './components/History';
import { getHistory, addHistoryItem, clearHistory } from './services/historyService';
import type { FormattedResult } from './types';
import { ImageEditor } from './components/editor/ImageEditor';
import { CreatePostIcon } from './components/icons/CreatePostIcon';
import { HomePage } from './components/HomePage';


const App: React.FC = () => {
    const [page, setPage] = useState<'home' | 'search'>('home');
    const [query, setQuery] = useState<string>('Al-Fatihah 1-7');
    const [history, setHistory] = useState<string[]>(getHistory());
    
    const [result, setResult] = useState<FormattedResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

    const handleFetch = useCallback(async (fetchQuery: string) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setIsEditorOpen(false);

        try {
            const parsedInput = await parseUserInput(fetchQuery);
            const data = await fetchQuranData(parsedInput);
            setResult(data);
            setHistory(addHistoryItem(fetchQuery));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSubmit = useCallback(() => {
        if (query.trim()) {
            handleFetch(query);
        }
    }, [query, handleFetch]);
    
    const handleHistoryClick = useCallback((item: string) => {
        setQuery(item);
        handleFetch(item);
    }, [handleFetch]);

    const handleClearHistory = useCallback(() => {
        clearHistory();
        setHistory([]);
    }, []);

    if (page === 'home') {
        return <HomePage onNavigate={() => setPage('search')} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-6 md:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 font-amiri">Quran Ayah Fetcher</h1>
                <p className="text-gray-400 mt-2">Retrieve Quranic verses with Urdu translation.</p>
            </header>

            <main className="w-full max-w-4xl">
                <InputForm
                    query={query}
                    setQuery={setQuery}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
                
                <History 
                    items={history}
                    onItemClick={handleHistoryClick}
                    onClear={handleClearHistory}
                    isLoading={isLoading}
                />
                
                {error && <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">{error}</div>}

                {isLoading && <Loader message="Fetching verse..." />}
                
                {result && !isLoading && (
                    <div className="mt-8">
                        <div className="p-6 bg-gray-800 border border-yellow-700/50 rounded-lg shadow-2xl">
                            <ResultDisplay result={result} />
                        </div>
                         <div className="mt-6 text-center">
                            <button
                                onClick={() => setIsEditorOpen(true)}
                                className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-md transition-colors shadow-lg"
                            >
                                <CreatePostIcon className="w-6 h-6" />
                                Create Image Post
                            </button>
                        </div>
                    </div>
                )}
                
            </main>

            {isEditorOpen && result && (
                <ImageEditor 
                    result={result} 
                    onClose={() => setIsEditorOpen(false)}
                />
            )}
        </div>
    );
};

export default App;