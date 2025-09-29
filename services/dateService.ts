// services/dateService.ts
interface HijriDateInfo {
    date: string;
    day: string;
    month: {
        number: number;
        en: string;
    };
    year: string;
}

interface AlAdhanResponse {
    code: number;
    status: string;
    data: {
        hijri: HijriDateInfo;
    };
}

export async function fetchIslamicDate(): Promise<string | null> {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const gregorianDate = `${day}-${month}-${year}`;

    try {
        const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${gregorianDate}`);
        if (!response.ok) {
            console.error('Failed to fetch Islamic date from API.');
            return null;
        }
        const data: AlAdhanResponse = await response.json();
        if (data.code === 200 && data.data && data.data.hijri) {
            const hijri = data.data.hijri;
            // e.g., "15 Muharram 1446"
            return `${hijri.day} ${hijri.month.en} ${hijri.year}`;
        }
        return null;
    } catch (error) {
        console.error('Error fetching or parsing Islamic date:', error);
        return null;
    }
}