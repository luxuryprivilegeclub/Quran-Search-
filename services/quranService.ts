import type { Chapter, ParsedInput, FormattedResult } from '../types';

// New, more reliable API source
const API_BASE_URL = 'https://api.alquran.cloud/v1';
const URDU_EDITION = 'ur.jalandhry'; // Fateh Muhammad Jalandhry translation
const ARABIC_EDITION = 'quran-uthmani';

let chaptersCache: Chapter[] | null = null;

// Updated function to fetch chapter list from the new API
async function getChapters(): Promise<Chapter[]> {
    if (chaptersCache) {
        return chaptersCache;
    }
    const response = await fetch(`${API_BASE_URL}/surah`);
    if (!response.ok) {
        throw new Error('Failed to fetch Surah list.');
    }
    const data = await response.json();
    if (!data.data) {
        throw new Error('Invalid data format for Surah list.');
    }
    chaptersCache = data.data;
    return chaptersCache!;
}

// Updated parser to work with the new chapter data structure
export async function parseUserInput(query: string): Promise<ParsedInput> {
    const chapters = await getChapters();
    
    query = query.toLowerCase().replace("surah", "").replace("ayat", "").replace("ayah", "").trim();

    const colonMatch = query.match(/^(\d+):(\d+)(?:-(\d+))?$/);
    if (colonMatch) {
        const chapter = parseInt(colonMatch[1], 10);
        const from = parseInt(colonMatch[2], 10);
        const to = colonMatch[3] ? parseInt(colonMatch[3], 10) : from;
        return { chapter, from, to };
    }

    const spaceMatch = query.match(/^([a-zA-Z\d\s-]+[a-zA-Z])\s+(\d+)(?:-(\d+))?$/) || query.match(/^(\d+)\s+(\d+)(?:-(\d+))?$/);
     if (spaceMatch) {
        const surahIdentifier = spaceMatch[1].trim();
        const from = parseInt(spaceMatch[2], 10);
        const to = spaceMatch[3] ? parseInt(spaceMatch[3], 10) : from;

        let chapter: number;
        if (!isNaN(parseInt(surahIdentifier, 10))) {
            chapter = parseInt(surahIdentifier, 10);
        } else {
            const foundChapter = chapters.find(c => c.englishName.toLowerCase().replace(/[\s-]/g, "") === surahIdentifier.replace(/[\s-]/g, ""));
            if (!foundChapter) {
                throw new Error(`Surah "${surahIdentifier}" not found.`);
            }
            chapter = foundChapter.number;
        }
        return { chapter, from, to };
    }

    throw new Error('Invalid input format. Use "Surah Name Ayah", "2:4", or "2 4-6".');
}

// Completely rewritten function to be more robust by fetching editions separately
export async function fetchQuranData({ chapter, from, to }: ParsedInput): Promise<FormattedResult> {
    const chapters = await getChapters();
    const chapterInfo = chapters.find(c => c.number === chapter);

    if (!chapterInfo) {
        throw new Error('Surah not found.');
    }
    if (from < 1 || to > chapterInfo.numberOfAyahs || from > to) {
        throw new Error(`Invalid ayah range for ${chapterInfo.englishName}. It has ${chapterInfo.numberOfAyahs} verses.`);
    }

    // Fetch Arabic and Urdu editions in parallel for better reliability
    const arabicPromise = fetch(`${API_BASE_URL}/surah/${chapter}/${ARABIC_EDITION}`);
    const urduPromise = fetch(`${API_BASE_URL}/surah/${chapter}/${URDU_EDITION}`);

    const [arabicResponse, urduResponse] = await Promise.all([arabicPromise, urduPromise]);

    if (!arabicResponse.ok) {
        throw new Error(`Failed to fetch Arabic text for Surah ${chapter}. Status: ${arabicResponse.status}`);
    }
    if (!urduResponse.ok) {
        throw new Error(`Failed to fetch Urdu translation for Surah ${chapter}. Status: ${urduResponse.status}`);
    }

    const arabicResult = await arabicResponse.json();
    const urduResult = await urduResponse.json();

    if (arabicResult.code !== 200 || !arabicResult.data || !arabicResult.data.ayahs) {
        throw new Error('Received invalid data structure for Arabic text from the server.');
    }
    if (urduResult.code !== 200 || !urduResult.data || !urduResult.data.ayahs) {
        throw new Error('Received invalid data structure for Urdu translation from the server.');
    }
    
    const arabicAyahs = arabicResult.data.ayahs;
    const urduAyahs = urduResult.data.ayahs;

    if (arabicAyahs.length !== urduAyahs.length) {
        throw new Error('Data mismatch: The number of Arabic verses and Urdu translations do not match.');
    }

    const combinedVerses = [];
    // Loop through the requested range and combine the verses
    for (let i = from; i <= to; i++) {
        const verseIndex = i - 1; // API's ayahs array is 0-indexed
        const arabicVerse = arabicAyahs[verseIndex];
        const urduVerse = urduAyahs[verseIndex];

        if (!arabicVerse || !urduVerse || arabicVerse.numberInSurah !== i || urduVerse.numberInSurah !== i) {
            // This is a safety check in case the arrays are misaligned
            console.error(`Data integrity error at ayah ${i}. Skipping this verse.`);
            continue;
        }

        combinedVerses.push({
            number: arabicVerse.numberInSurah,
            arabicText: arabicVerse.text,
            urduText: urduVerse.text
        });
    }

    if (combinedVerses.length === 0) {
        throw new Error('No verses were found for the specified range. This might be due to an API data issue.');
    }

    return {
        surahNameSimple: chapterInfo.englishName,
        surahNameArabic: chapterInfo.name,
        surahNumber: chapter,
        ayahRange: from === to ? `${from}` : `${from}–${to}`,
        verses: combinedVerses,
    };
}
