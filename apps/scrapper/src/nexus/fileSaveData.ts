// import { InferSelectModel, eq, sql } from "drizzle-orm";
// import { jobs } from "./fileLogger";
// import { DbConnector } from "./connection";

// export async function saveData(
//   fileJobHandler: InferSelectModel<typeof jobs>,
//   data: unknown
// ): Promise<boolean> {
//   try {
//     const dbConnector = new DbConnector();

//     const db = await dbConnector.connect();
//     const strData = JSON.stringify(data);
//     await db
//       .update(jobs)
//       .set({
//         updated_at: sql`NOW()`,
//         data: strData,
//       })
//       .where(eq(jobs.file_sha1, fileJobHandler.file_sha1));
//     await dbConnector.disconnect();
//     return true;
//   } catch (err) {
//     console.error(err);
//     throw new Error(
//       `Unable to write processed data in the file log's DB. ${fileJobHandler.file_name}`
//     );
//   }
// }
