// import { UpdateRequestPolizasInRange } from "@asurandi/types";
// import { AnasegurosPortal } from "../anaseguros/anasegurosPortal.js";

// export const dailyScrapperAna = async (request: UpdateRequestPolizasInRange) => {
//     const saasId = request.payload.saasId
//     const portalSession = new AnasegurosPortal({
//         saasId,
//         agent: request.payload.agent,
//         cuenta: request.payload.cuenta
//     })
//     await portalSession.dailyScrapper(request.payload.start, request.payload.end)
// }