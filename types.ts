export interface UserInput {
    query: string;
}

export interface ParsedInput {
    chapter: number;
    from: number;
    to: number;
}

export interface Chapter {
    number: number;
    englishName: string;
    name: string; // This is the Arabic name
    numberOfAyahs: number;
}

export interface Verse {
    id: number;
    verse_key: string;
    text_uthmani: string;
}

export interface Translation {
    id: number;
    resource_id: number;
    text: string;
}

export interface FormattedResult {
    surahNameSimple: string;
    surahNameArabic: string;
    surahNumber: number;
    ayahRange: string;
    verses: {
        number: number;
        arabicText: string;
        urduText: string;
    }[];
}