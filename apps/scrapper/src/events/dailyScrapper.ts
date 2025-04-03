import { dailyScrapperQualitas } from "./dailyScrapperQualitas.js";
import { MessageBusMessage, UpdateRequestPolizasInRange } from "@asurandi/types";
export async function dailyScrapper(request: MessageBusMessage<UpdateRequestPolizasInRange>) {
    await dailyScrapperQualitas(request)
    // TODO: Agregar scrapper de otras agencias
}