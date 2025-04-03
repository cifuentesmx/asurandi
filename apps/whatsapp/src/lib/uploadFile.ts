import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { initializeAdminApp } from "./firebase.server.ts";

export async function uploadFile(originalFullFileName: string, destinationFolderName: string) {
  const fileName = originalFullFileName.split("/").pop();
  const destination = `${destinationFolderName}/${fileName}`;
  const app = initializeAdminApp()
  const storage = getStorage(app);
  const bucket = storage.bucket();
  const url = await bucket
    .upload(originalFullFileName, {
      destination, metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    })
    .then(async (resp) => {
      const ref = bucket.file(destination);
      const u = await getDownloadURL(ref);
      return u
    })
    .catch((err) => {
      console.error("upload failed >>>>");
      console.error(err);
    });

  return url;
}

