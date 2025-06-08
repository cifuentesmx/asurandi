export function readPDF(fileName: string): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const { PdfReader } = await import("pdfreader");
            const reader = new PdfReader({});

            const file: any[] = [];
            reader.parseFileItems(fileName, async (err, item) => {
                if (err) throw err;
                else if (!item) {
                    file.push("eof");
                    return resolve(file);
                } else if (item) file.push(item);
            });
        } catch (err) {
            reject(err);
        }
    });
}
