// Bikram Sambat (B.S.) Date Converter for Nepali Calendar
// Converts A.D. dates to B.S. dates (Baisakh, Jestha, etc.)

(function () {
    'use strict';

    // B.S. to A.D. conversion reference data (2080-2085 B.S.)
    // Each array represents days in each month for that year
    const bsCalendarData = {
        2080: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2023-2024 AD
        2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2024-2025 AD
        2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2025-2026 AD
        2083: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2026-2027 AD
        2084: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2027-2028 AD
        2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]  // 2028-2029 AD
    };

    // Base reference: 2080 Baishakh 1 = 2023 April 14
    const baseAdDate = new Date(2023, 3, 14); // April 14, 2023
    const baseBsYear = 2080;
    const baseBsMonth = 0; // Baishakh (0-indexed)
    const baseBsDay = 1;

    // Nepali month names
    const nepaliMonths = [
        'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
        'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत'
    ];

    const englishMonthsNepali = [
        'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
        'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
    ];

    // Nepali day names
    const nepaliDays = [
        'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'
    ];

    const englishDays = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    // Nepali numerals
    const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

    /**
     * Convert number to Nepali numerals
     */
    function toNepaliNumber(num) {
        return num.toString().split('').map(digit => nepaliNumerals[parseInt(digit)]).join('');
    }

    /**
     * Convert A.D. date to B.S. date
     */
    function adToBs(adDate) {
        // Calculate days difference from base date
        const diffTime = adDate - baseAdDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let bsYear = baseBsYear;
        let bsMonth = baseBsMonth;
        let bsDay = baseBsDay + diffDays;

        // Adjust for days overflow
        while (bsDay > (bsCalendarData[bsYear] ? bsCalendarData[bsYear][bsMonth] : 30)) {
            if (!bsCalendarData[bsYear]) {
                bsDay -= 30;
            } else {
                bsDay -= bsCalendarData[bsYear][bsMonth];
            }
            bsMonth++;

            if (bsMonth >= 12) {
                bsMonth = 0;
                bsYear++;
            }
        }

        // Adjust for negative days
        while (bsDay < 1) {
            bsMonth--;
            if (bsMonth < 0) {
                bsMonth = 11;
                bsYear--;
            }
            if (bsCalendarData[bsYear]) {
                bsDay += bsCalendarData[bsYear][bsMonth];
            } else {
                bsDay += 30;
            }
        }

        return {
            year: bsYear,
            month: bsMonth,
            day: bsDay,
            monthName: nepaliMonths[bsMonth],
            monthNameEng: englishMonthsNepali[bsMonth]
        };
    }

    /**
     * Format B.S. date in Nepali
     */
    function formatBsDateNepali(adDate) {
        const bs = adToBs(adDate);
        const dayName = nepaliDays[adDate.getDay()];

        return `${dayName}, ${bs.monthName} ${toNepaliNumber(bs.day)}, ${toNepaliNumber(bs.year)}`;
    }

    /**
     * Format B.S. date in English
     */
    function formatBsDateEnglish(adDate) {
        const bs = adToBs(adDate);
        const dayName = englishDays[adDate.getDay()];

        return `${dayName}, ${bs.monthNameEng} ${bs.day}, ${bs.year}`;
    }

    /**
     * Get short B.S. date (for news meta)
     */
    function getShortBsDate(adDate) {
        const bs = adToBs(adDate);
        return {
            nepali: `${bs.monthName} ${toNepaliNumber(bs.day)}, ${toNepaliNumber(bs.year)}`,
            english: `${bs.monthNameEng} ${bs.day}, ${bs.year}`
        };
    }

    /**
     * Convert YYYY-MM-DD string to B.S. date
     */
    function convertDateString(dateString) {
        const adDate = new Date(dateString);
        return adToBs(adDate);
    }

    // Export to global scope
    window.NepaliDateConverter = {
        adToBs: adToBs,
        formatBsDateNepali: formatBsDateNepali,
        formatBsDateEnglish: formatBsDateEnglish,
        getShortBsDate: getShortBsDate,
        convertDateString: convertDateString,
        toNepaliNumber: toNepaliNumber,
        nepaliMonths: nepaliMonths,
        englishMonthsNepali: englishMonthsNepali,
        nepaliDays: nepaliDays,
        englishDays: englishDays
    };

})();
