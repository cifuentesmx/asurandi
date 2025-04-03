import { deleteOldFilesAndDirectories } from "./lib/deleteOldFiles.js";

let cleanupInterval: NodeJS.Timeout;

export const startCleanupFilesJob = () =>{
    if (!cleanupInterval) cleanupInterval = setInterval(async () => {
      console.info("Recolectando basura de archivos temporales");
      await deleteOldFilesAndDirectories(`${process.cwd()}/storage/tmp`)
    }, 60 * 60 * 1000);
    return cleanupInterval
  }
  