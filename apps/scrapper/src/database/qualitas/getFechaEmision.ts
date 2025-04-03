const months = {
    "01": "01",
    "02": "02",
    "03": "03",
    "04": "04",
    "05": "05",
    "06": "06",
    "07": "07",
    "08": "08",
    "09": "09",
    "10": "10",
    "11": "11",
    "12": "12",
    enero: "01",
    febrero: "02",
    marzo: "03",
    abril: "04",
    mayo: "05",
    junio: "06",
    julio: "07",
    agosto: "08",
    septiembre: "09",
    octubre: "10",
    noviembre: "11",
    diciembre: "12",
    ene: "01",
    jan: "01",
    feb: "02",
    mar: "03",
    abr: "04",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    ago: "08",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dic: "12",
};

export function getFechaEmision(str?: string): string | null {
    if (!str) return null;

    const matches = str.match(/\d+/g);
    const middleStr = str.split('/')[1]
        ?.toLowerCase()
        ?.trim();
    const month = months[`${middleStr}`];
    const day = matches?.[0];
    const year = matches?.[1];

    if (!month || !day || !year) return null;
    return `${year}-${month}-${day}`;
}
export function getFechaRecibos(str?: string): string | null {
    if (!str) return null;

    const strs = str.split('/')
    const middleStr = strs[1]
        ?.toLowerCase()
        ?.trim();
    const month = months[`${middleStr}`];
    const day = strs[0];
    const year = strs[2];

    if (!month || !day || !year) return null;
    return `${year}-${month}-${day}`;
}
