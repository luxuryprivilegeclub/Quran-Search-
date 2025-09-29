import React, { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import type { FormattedResult } from '../../types';
import { EditorPreview } from './EditorPreview';
import { EditorControls } from './EditorControls';
import { CloseIcon } from '../icons/CloseIcon';
import { DownloadIcon } from '../icons/DownloadIcon';
import { fetchIslamicDate } from '../../services/dateService';

// This is required because we are loading html-to-image from a CDN
declare const htmlToImage: any;


interface ImageEditorProps {
    result: FormattedResult;
    onClose: () => void;
}

export interface EditorStyles {
    background: string;
    backgroundOverlay: number;
    arabicColor: string;
    urduColor: string;
    greetingColor: string;
    arabicSize: number;
    urduSize: number;
    greetingSize: number;
    greetingText: string;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ result, onClose }) => {
    const [styles, setStyles] = useState<EditorStyles>({
        background: 'linear-gradient(135deg, #2a3a35, #3a2a2a)',
        backgroundOverlay: 0.3,
        arabicColor: '#ffffff',
        urduColor: '#e5e7eb',
        greetingColor: '#fcd34d',
        arabicSize: 72,
        urduSize: 52,
        greetingSize: 60,
        greetingText: '',
    });
    const [isDownloading, setIsDownloading] = useState(false);
    const [islamicDate, setIslamicDate] = useState<string | null>(null);
    const previewCanvasRef = useRef<HTMLDivElement>(null);
    const previewWrapperRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.1); // Start small to avoid a flash of large un-styled content

    useEffect(() => {
        const getAndSetDate = async () => {
            const date = await fetchIslamicDate();
            setIslamicDate(date);
        };
        getAndSetDate();
    }, []);

     // This effect calculates the correct scaling factor to fit the preview canvas
     // within its container without breaking the layout.
     useLayoutEffect(() => {
        const updateScale = () => {
            if (previewWrapperRef.current) {
                const { width, height } = previewWrapperRef.current.getBoundingClientRect();
                const canvasSize = 2048; // Native resolution of the canvas
                if (width > 0 && height > 0) {
                    const scaleX = width / canvasSize;
                    const scaleY = height / canvasSize;
                    setScale(Math.min(scaleX, scaleY) * 0.90); // Use 0.90 for a bit more padding
                }
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);


    const handleDownload = useCallback(async () => {
        if (!previewCanvasRef.current) return;
        setIsDownloading(true);
        try {
            const dataUrl = await htmlToImage.toPng(previewCanvasRef.current, {
                quality: 1,
                pixelRatio: 1, // Capture at its native 2048x2048 size
            });
            const link = document.createElement('a');
            link.download = `quran-${result.surahNumber}-${result.ayahRange.replace('–', '_')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Oops, something went wrong!', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    }, [result]);

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex flex-col md:flex-row p-2 sm:p-4 gap-4 animate-fade-in" aria-modal="true" role="dialog">
            {/* Preview Area (Placed first for mobile layout) */}
            <main ref={previewWrapperRef} className="w-full h-[55vh] md:h-full flex-grow flex items-center justify-center bg-gray-800/50 rounded-lg p-4 overflow-hidden">
                 <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}>
                     <EditorPreview ref={previewCanvasRef} result={result} styles={styles} islamicDate={islamicDate} />
                 </div>
            </main>
            
            {/* Controls Panel (Placed second for mobile layout) */}
            <aside className="w-full h-[45vh] md:h-full md:w-[320px] lg:w-[380px] flex-shrink-0 bg-gray-900 p-4 rounded-lg shadow-2xl flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-yellow-400">Image Editor</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors" aria-label="Close editor">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    <EditorControls styles={styles} setStyles={setStyles} />
                </div>
                 <div className="mt-4 pt-4 border-t border-gray-700 flex-shrink-0">
                    <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                       {isDownloading ? (
                           <>
                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                           <span>Generating...</span>
                           </>
                       ) : (
                           <>
                           <DownloadIcon className="w-6 h-6" />
                           Download Image
                           </>
                       )}
                    </button>
                </div>
            </aside>
        </div>
    );
};

// Add custom animations and styles for mobile optimization
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

/* Custom styles for range inputs for better mobile usability */
input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    cursor: pointer;
    outline: none;
    border-radius: 8px;
    height: 8px;
    background: #4b5563; /* Tailwind gray-600 */
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    background: #fcd34d; /* Tailwind yellow-400 */
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 4px rgba(0,0,0,0.5);
    margin-top: -8px; /* Recalculated for larger thumb */
}

input[type="range"]::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: #fcd34d;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 4px rgba(0,0,0,0.5);
}
`;
document.head.appendChild(style);