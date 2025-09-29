import React from 'react';
import type { FormattedResult } from '../types';

interface ResultDisplayProps {
    result: FormattedResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    return (
        <div className="text-white space-y-6">
            <div className="text-center">
                <p className="text-2xl font-amiri text-yellow-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            </div>

            <div className="text-center border-t border-b border-gray-600 py-3">
                <h2 className="text-3xl font-bold font-amiri">{result.surahNameArabic}</h2>
                <p className="text-lg text-gray-300">Surah {result.surahNameSimple} — Surah {result.surahNumber}</p>
                <p className="text-md text-gray-400">Ayah {result.ayahRange}</p>
            </div>
            
            <div dir="rtl" className="space-y-4">
                {result.verses.map((verse, index) => (
                    <p key={index} className="text-2xl md:text-3xl font-amiri leading-relaxed text-right">
                       {verse.arabicText} <span className="text-yellow-400 text-lg">({verse.number})</span>
                    </p>
                ))}
            </div>

            <div className="border-t border-gray-600 pt-4">
                <h3 dir="rtl" className="text-2xl font-nastaliq text-center text-yellow-400 mb-4">اردو ترجمہ</h3>
                <div dir="rtl" className="space-y-3">
                    {result.verses.map((verse, index) => (
                        <p key={index} className="text-xl md:text-2xl font-nastaliq leading-loose text-right">
                           <span className="text-yellow-400 ml-2">({verse.number})</span> {verse.urduText}
                        </p>
                    ))}
                </div>
            </div>
            
            <div className="text-center pt-6 border-t border-gray-600 mt-8">
                 <p className="text-gray-400">Talib e Dua Rao Abdul Waheed Khan</p>
                 <p className="font-nastaliq text-lg text-gray-300">طالب دعا راؤ عبدُالوحید خان</p>
            </div>
        </div>
    );
};