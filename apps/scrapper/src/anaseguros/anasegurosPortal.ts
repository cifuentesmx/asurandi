// import { CompanyPortalSession, ScrappedPolizaEvent } from "@asurandi/types";

// const password = 'H1p3r590'
// const user_type = 'Agente'
// const user = '09660'


// export class AnasegurosPortal implements CompanyPortalSession {
//     private saasId: string;
//     private agent: string;
//     private cuenta: string;
//     private baseUrl: string = 'https://anaseguros.com.mx/anaweb/index.html';

//     constructor(
//         { saasId, agent, cuenta }:
//             { saasId: string, agent: string, cuenta: string }) {
//         this.saasId = saasId
//     }

//     async open() {
//         console.log("Opening Anaseguros portal");
//     }

//     async close() {
//         console.log("Closing Anaseguros portal");
//     }

//     async updatePoliza(numero_poliza: string): Promise<ScrappedPolizaEvent> {
//         console.log("Updating Anaseguros poliza", numero_poliza);
//         throw new Error("Not implemented");
//     }

//     async dailyScrapper(start: string, end: string): Promise<void> {
//         console.log("Daily scrapper Anaseguros", start, end);
//     }
// }