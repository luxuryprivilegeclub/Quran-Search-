import React, { forwardRef } from 'react';
import type { FormattedResult } from '../../types';
import type { EditorStyles } from './ImageEditor';
import { LuxuryDividerIcon } from '../icons/LuxuryDividerIcon';

interface EditorPreviewProps {
    result: FormattedResult;
    styles: EditorStyles;
    islamicDate: string | null;
}

const INFO_COLOR = '#fcd34d'; // A nice gold (tailwind yellow-400)
const SUBTLE_COLOR = '#d1d5db'; // A subtle gray (tailwind gray-300)

export const EditorPreview = forwardRef<HTMLDivElement, EditorPreviewProps>(({ result, styles, islamicDate }, ref) => {
    
    const compositeBackgroundImage = `linear-gradient(rgba(0, 0, 0, ${styles.backgroundOverlay}), rgba(0, 0, 0, ${styles.backgroundOverlay})), ${styles.background}`;

    return (
        <div 
            ref={ref} 
            style={{ 
                width: '1152px', 
                height: '2048px',
                backgroundImage: compositeBackgroundImage,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }} 
            className="overflow-hidden transition-all duration-300"
        >
             <div
                className="w-full h-full text-white flex flex-col items-center py-32 px-24"
            >
                {/* Bismillah */}
                <div className="text-center mb-16">
                    <p className="font-amiri whitespace-nowrap" style={{ fontSize: '70px', color: INFO_COLOR }}>
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                </div>

                {/* Main Content Wrapper */}
                <div className="flex flex-col items-center w-full">
                    {/* Surah Info */}
                    <div className="text-center mb-16 w-full">
                        <h2 className="font-bold font-amiri" style={{ fontSize: '110px', color: styles.arabicColor }}>{result.surahNameArabic}</h2>
                        <p className="mt-4" style={{ fontSize: '40px', color: SUBTLE_COLOR }}>Surah {result.surahNameSimple} — Surah {result.surahNumber}</p>
                        <p className="mt-2" style={{ fontSize: '35px', color: SUBTLE_COLOR }}>Ayah {result.ayahRange}</p>
                    </div>
                    
                    {/* Arabic Text */}
                    <div dir="rtl" className="space-y-6 mb-16 w-full max-w-5xl">
                        {result.verses.map((verse) => (
                            <p key={verse.number} className="font-amiri leading-normal text-center" style={{ fontSize: `${styles.arabicSize}px`, color: styles.arabicColor }}>
                               {verse.arabicText} <span style={{ fontSize: `${styles.arabicSize * 0.6}px`, color: INFO_COLOR }}>({verse.number})</span>
                            </p>
                        ))}
                    </div>

                    {/* Urdu Translation */}
                    <div className="w-full max-w-5xl">
                        <h3 dir="rtl" className="font-nastaliq text-center mb-8" style={{ fontSize: '60px', color: INFO_COLOR }}>اردو ترجمہ</h3>
                        <div dir="rtl" className="space-y-8">
                            {result.verses.map((verse) => (
                                <p key={verse.number} className="font-nastaliq leading-relaxed text-center" style={{ fontSize: `${styles.urduSize}px`, color: styles.urduColor }}>
                                   <span className="ml-4" style={{ color: INFO_COLOR }}>({verse.number})</span> {verse.urduText}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Greeting and Divider (Optional) */}
                    {styles.greetingText && (
                        <div className="text-center mt-28 mb-8 flex flex-col items-center gap-8">
                            <LuxuryDividerIcon style={{ color: INFO_COLOR, opacity: 0.6 }} />
                            <p className="font-nastaliq" style={{ fontSize: `${styles.greetingSize}px`, color: styles.greetingColor }}>
                                {styles.greetingText}
                            </p>
                        </div>
                    )}
                </div>
                
                {/* This flexible spacer pushes the footer to the bottom, ensuring content isn't stretched out */}
                <div className="flex-grow" />

                {/* Footer */}
                <div className="text-center w-full">
                     <p style={{ fontSize: '28px', color: SUBTLE_COLOR }}>Talib e Dua Rao Abdul Waheed Khan</p>
                     <p className="font-nastaliq mt-2" style={{ fontSize: '32px', color: SUBTLE_COLOR }}>طالب دعا راؤ عبدُالوحید خان</p>
                     {islamicDate && (
                         <p className="mt-4" style={{ fontSize: '26px', color: SUBTLE_COLOR }}>{islamicDate}</p>
                     )}
                </div>
            </div>
        </div>
    );
});