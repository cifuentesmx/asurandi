export function extractFullText(
    data: {
        x?: number;
        y?: number;
        w?: number;
        sw?: number;
        text?: string;
    }[],
    i: number
): string {
    try {
        let str = data[i].text ?? "";
        let shouldContinue = true;
        let idx = i;
        while (shouldContinue) {
            idx++;
            shouldContinue = false;
            const specials = [
                "&",
                "ñ",
                "Ñ",
                "á",
                "Á",
                "é",
                "É",
                "í",
                "Í",
                "ó",
                "Ó",
                "ú",
                "Ú",
                "ä",
                "Ä",
                "ë",
                "Ë",
                "ï",
                "Ï",
                "ö",
                "Ö",
                "ü",
                "Ü",
                "à",
                "è",
                "ì",
                "ò",
                "ù",
                "À",
                "È",
                "Ì",
                "Ò",
                "Ù",
                "Ç",
                "ç",
                "Ḉ",
                "ḉ",
                "Ḑ",
                "ḑ",
                "Ȩ",
                "ȩ",
                "Ḝ",
                "ḝ",
                "Ģ",
                "Ḩ",
                "ḩ",
                "Ķ",
                "ķ",
                "Ļ",
                "ļ",
                "Ņ",
                "ņ",
                "Ŗ",
                "ŗ",
                "Ş",
                "ş",
                "Ţ",
                "ţ",
            ];
            const text = data[idx].text;
            if (specials.includes(text ?? "")) {
                idx++;
                str += `${text}${data[idx].text}`;
                shouldContinue = true;
            }
        }

        return str.trim();
    } catch (err) {
        return "";
    }
}

export function extractRestLine(
    data: {
        x?: number;
        y?: number;
        w?: number;
        sw?: number;
        text?: string;
    }[],
    i: number
): string {
    try {
        let str = data[i].text ?? "";
        let shouldContinue = true;
        let idx = i;
        while (shouldContinue) {
            idx++;
            shouldContinue = false;
            let { text, y, x } = data[idx];

            if (y && x && x > (data?.[i]?.x ?? 900) && y === data[i].y) {
                str += `${text}`;
                shouldContinue = true;
            }
        }

        return str.trim();
    } catch (err) {
        return "";
    }
}
