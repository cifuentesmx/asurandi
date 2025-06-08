import { ScrappedAnasegurosPoliza } from "../scrapePoliza.js"
import { downloadFile } from "./downloadFile.js"
import { readPDF } from "../../utils/readPDF.js"
import { PublicFileUrl } from "@asurandi/types"
import { uploadFile } from "utils/uploadFile.js"
import { type DataFromPdf, extractDataFromPdf } from "./extactDataFromPdf.js"
import { saveMaestra } from "./saveMaestra.js"

export const processScrapped = async (scrappedPolizas: ScrappedAnasegurosPoliza[], saasId: string): Promise<void> => {
    console.log('Procesando polizas', scrappedPolizas.length)
    for (const poliza of scrappedPolizas) {
        console.log('Procesando poliza', poliza.poliza, poliza.endoso)
        let data: (DataFromPdf & { publicFileUrl: PublicFileUrl }) | null = null
        if (poliza.link) {
            data = await downloadFile(poliza)
                .then(async (file) => {
                    const publicUrl = await uploadFile(file, `p/${saasId}/polizas/a${poliza.poliza}`)

                    if (!publicUrl) {
                        throw new Error('Error al subir archivo')
                    }

                    const publicFileUrl: PublicFileUrl = {
                        url: publicUrl,
                        fileName: file.split('/').pop() ?? '',
                        path: `p/${saasId}/polizas/a${poliza.poliza}`,
                        caption: `Póliza ${poliza.poliza}-${poliza.endoso}`,
                        mimeType: 'application/pdf'
                    }
                    const data: DataFromPdf = await readPDF(file).then(async (pdf) => {
                        const data: DataFromPdf = await extractDataFromPdf(pdf)
                        return data
                    }).catch((err) => {
                        console.error('Error al extraer datos de PDF', err)
                        throw new Error(err.message)
                    })

                    return {
                        ...data,
                        publicFileUrl
                    }
                })
        }
        if (Number(poliza.endoso) === 0) {
            await saveMaestra(poliza, data, saasId)
        }

    }

}