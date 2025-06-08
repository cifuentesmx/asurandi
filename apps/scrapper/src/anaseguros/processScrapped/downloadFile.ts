import { ScrappedAnasegurosPoliza } from "anaseguros/scrapePoliza.js";
import path from "node:path";
import fs from "node:fs";

export const downloadFile = async (poliza: ScrappedAnasegurosPoliza): Promise<string> => {
    const response = await fetch(poliza.link)
    const buffer = await response.arrayBuffer()
    const fileName = `${poliza.poliza}_${poliza.endoso}.pdf`
    const filePath = path.join(process.cwd(), 'storage', 'tmp', fileName)

    // Ensure directory exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(filePath, Buffer.from(buffer))
    return filePath

}