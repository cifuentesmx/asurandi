import { tblConductos } from "@asurandi/database"
import { pgDb } from "db.js"

export const sendTodos = async () => {
    const conductos = await pgDb.select().from(tblConductos)
    console.log(conductos)
}