
import { jsPDF } from 'jspdf';
import { applyPlugin, UserOptions } from 'jspdf-autotable'


declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: UserOptions) => jsPDF;
        autoTableSetDefaults: (options: any) => void;
    }
}


applyPlugin(jsPDF)


export class newPDF extends jsPDF {
    constructor() {
        super()
        this.autoTableSetDefaults({
            rowPageBreak: 'avoid',
            bodyStyles: {
                fontSize: 8,
            },
            headStyles: {
                fontSize: 8,
                valign: 'middle',
                halign: 'center'
            },
        })
    }
}
