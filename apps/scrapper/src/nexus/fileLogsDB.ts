// import { InferSelectModel, SQL, eq, sql } from "drizzle-orm";
// import { jobs } from "./fileLogger";
// import { DbConnector } from "./connection";

// export const getFileState = async (
//   file_sha1: string,
//   file_name: string,
//   full_file_name: string
// ) => {
//   const dbConnector = new DbConnector();
//   const db = await dbConnector.connect();
//   let result = await db
//     .select()
//     .from(jobs)
//     .where(eq(jobs.file_sha1, file_sha1));
//   await dbConnector.disconnect();
//   if (result.length === 1) return result[0];

//   await pgDb.insert(jobs).values({
//     file_sha1,
//     file_name,
//     full_file_name,
//   });

//   const created = await db
//     .select()
//     .from(jobs)
//     .where(eq(jobs.file_sha1, file_sha1));

//   await dbConnector.disconnect();
//   if (created.length === 1) return created[0];
//   throw new Error(
//     "No se pudo crear un registro para el progreso en el procesamiento del archivo."
//   );
// };

// export async function setStatus(
//   fileJobHandler: InferSelectModel<typeof jobs>,
//   status: "STALE" | "PROCESSING" | "ERROR" | "SUCCESS",
//   errorMsg?: string
// ): Promise<boolean> {
//   try {
//     const dbConnector = new DbConnector();
//     const db = await dbConnector.connect();
//     if (!fileJobHandler.intent) fileJobHandler.intent = 0;
//     let errors = fileJobHandler.errors
//       ? await JSON.parse(fileJobHandler.errors)
//       : [];
//     if (!Array.isArray(errors)) errors = [];
//     if (errorMsg) {
//       errors.push(errorMsg);
//     }
//     let errored_at: SQL<unknown> | Date | null = fileJobHandler.errored_at;
//     if (status === "ERROR") {
//       errored_at = sql`NOW()`;
//     }
//     const intent =
//       status === "PROCESSING"
//         ? fileJobHandler.intent + 1
//         : fileJobHandler.intent;
//     await db
//       .update(jobs)
//       .set({
//         updated_at: sql`NOW()`,
//         status,
//         intent,
//         errors: JSON.stringify(errors),
//         errored_at,
//       })
//       .where(eq(jobs.file_sha1, fileJobHandler.file_sha1));

//     await dbConnector.disconnect();
//     return true;
//   } catch (err) {
//     console.error(err);
//     throw new Error(
//       `Unable to start file process log in DB. ${fileJobHandler.file_name}`
//     );
//   }
// }

// export async function reportIncident(fileName: string, incident: string) {
//   const dbConnector = new DbConnector();
//   const db = await dbConnector.connect();
//   const existing = await db
//     .select()
//     .from(jobs)
//     .where(eq(jobs.file_name, fileName));
//   if (existing.length === 0) {
//     await dbConnector.disconnect();
//     throw new Error(
//       `No se pudo encontrar el registro del archivo en la cola de procesamiento. ${fileName}`
//     );
//   }

//   let incidents = existing[0].incidents
//     ? await JSON.parse(existing[0].incidents)
//     : [];
//   if (!Array.isArray(incidents)) incidents = [];
//   incidents.push(incident);
//   await db
//     .update(jobs)
//     .set({ incidents: JSON.stringify(incidents) })
//     .where(eq(jobs.file_name, fileName));

//   await dbConnector.disconnect();
//   return;
// }
