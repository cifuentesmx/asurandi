import { and, eq } from 'drizzle-orm';
import { pgDb } from '../db.js';
import { tblRenovaciones, tblPolizas, tblAsegurados, tblVehiculos, tblCobros, tblConductos } from '@asurandi/database';
import { newPDF } from '../configure-pdf.js';
import { storageSaveFile } from '../firebase/storageSaveFile.js';
import { PublicFileUrl } from '@asurandi/types';


export const reporteConductoCobranzaRenovaciones = async (conductoId: number): Promise<PublicFileUrl[]> => {
    const [conducto] = await pgDb.select().from(tblConductos).where(eq(tblConductos.id, conductoId))
    if (!conducto) {
        throw new Error(`Conducto ${conductoId} no encontrado`)
    }
    const porRenovar = await pgDb.select({
        id: tblPolizas.id,
        numeroPoliza: tblPolizas.numeroPoliza,
        fechaVencimiento: tblRenovaciones.fechaVencimiento,
        vigenciaFin: tblPolizas.vigenciaFin,
        asegurado: tblAsegurados.nombre,
        telefono: tblAsegurados.celular,
        email: tblAsegurados.email,
        vehiculo: tblVehiculos.nombre,
        importe: tblPolizas.total,
        status: tblRenovaciones.estado
    }).from(tblPolizas)
        .leftJoin(tblRenovaciones, eq(tblRenovaciones.polizaId, tblPolizas.id))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblPolizas.asegurado_id))
        .leftJoin(tblVehiculos, eq(tblVehiculos.id, tblPolizas.vehiculoId))
        .where(
            and(
                eq(tblPolizas.conductoId, conductoId),
                eq(tblRenovaciones.estado, 'PENDIENTE')
            )
        )
        .orderBy(tblRenovaciones.fechaVencimiento)

    const cobranza = await pgDb.select({
        id: tblCobros.id,
        fechaLimite: tblCobros.fechaLimite,
        fechaVencimiento: tblCobros.fechaVencimiento,
        serie: tblCobros.serie,
        numeroRecibo: tblCobros.numeroRecibo,
        importe: tblCobros.importe,
        status: tblCobros.estado,
        asegurado: tblAsegurados.nombre,
        vehiculo: tblVehiculos.nombre,
        telefono: tblAsegurados.celular,
        email: tblAsegurados.email
    }).from(tblPolizas)
        .leftJoin(tblCobros, eq(tblCobros.polizaId, tblPolizas.id))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblPolizas.asegurado_id))
        .leftJoin(tblVehiculos, eq(tblVehiculos.id, tblPolizas.vehiculoId))
        .where(
            and(
                eq(tblPolizas.conductoId, conductoId),
                eq(tblCobros.estado, 'PENDIENTE')
            )
        )

    const body = [...porRenovar.map((row) => [
        row.numeroPoliza,
        row.vehiculo ?? '',
        row.email ?? '',
        row.importe,
        row.fechaVencimiento as string,
        row.telefono ?? '',
        row.asegurado ?? '',
        'RENOVACIÓN DE PÓLIZA',
    ]),
    ...cobranza.map((row) => [
        `${row.numeroRecibo} / ${row.serie}`,
        row.vehiculo ?? '',
        row.email ?? '',
        row.importe,
        row.fechaLimite as string,
        row.telefono ?? '',
        row.asegurado ?? '',
        'COBRAR RECIBO DE PAGO',
    ])
    ].sort((a, b) => {
        return (a[4] ?? '').localeCompare(b[4] ?? '')
    })

    // Create PDF document inside the function
    const doc = new newPDF()

    doc.setFontSize(16)
        .text('Actividades pendientes', 15, 25)
        .setFontSize(12)
        .text(`Fecha de reporte: ${new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })}`, 15, 38)
        .text(`Agente: ${conducto.nombre}`, 15, 32)

    doc.autoTable({
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 4) {
                const diffTime = new Date(data.row.raw[4]).getTime() - new Date().getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays < 1) {
                    data.cell.styles.fillColor = [100, 32, 25]
                    data.cell.styles.textColor = [255, 255, 255]
                } else if (diffDays >= 1 && diffDays < 10) {
                    data.cell.styles.fillColor = [255, 70, 0]
                    data.cell.styles.textColor = [255, 255, 255]
                } else if (diffDays >= 10 && diffDays < 15) {
                    data.cell.styles.fillColor = [255, 220, 80]
                    data.cell.styles.textColor = [0, 0, 0]
                } else if (diffDays >= 15) {
                    data.cell.styles.fillColor = [140, 230, 120]
                    data.cell.styles.textColor = [0, 0, 0,]
                }
                data.cell.text = [data.row.raw[4], `${diffDays < 0 ? 'Hace' : 'En'} ${Math.abs(diffDays)} día(s)`]
            }
            if (data.section === 'body' && data.column.index === 5) {
                data.cell.text = ['', '', '', '']
            }
            if (data.section === 'body' && data.column.index === 1) {
                data.cell.text = [
                    data.row.raw[7],
                    ...data.cell.text,
                    data.row.raw[6]]
            }
            if (data.section === 'body' && data.column.index === 2) {
                data.cell.text = [data.row.raw[2], data.row.raw[5]]
            }
        },
        didDrawCell: (data) => {

            if (data.section === 'body' && data.column.index === 5) {
                const x = data.cell.x + 2;
                const y = data.cell.y + 5;

                let cell = data.row.raw[5]?.replace(/\D/g, '')
                cell = cell.length === 10 ? `+521${cell}` : null
                if (cell) doc.textWithLink('Whatsapp', x, y, { url: `https://wa.me/${cell}` });

                const tel = data.row.raw[5]?.replace(/\D/g, '')
                if (tel)
                    doc.textWithLink('Llamar', x, y + 5, { url: `tel:${tel}` });

                const email = data.row.raw[2]
                if (email) doc.textWithLink('Email', x, y + 10, { url: `mailto:${email}` });

            }
        },
        head: [[
            'Póliza',
            'Asegurado / vehiculo',
            'Contacto',
            'Importe',
            'Fecha límite',
            'Acciones',
        ]],
        body,
        startY: 45
    })

    const tempFilePath = `${process.cwd()}/storage/reporte-conducto-cobranza-renovaciones.pdf`
    doc.save(tempFilePath)

    const file = await storageSaveFile({
        files: [tempFilePath],
        storagePath: `p/reportes/${conducto.uid}/pendientes`
    })
    console.log(file)
    return file
} 