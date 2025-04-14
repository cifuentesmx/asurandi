import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import type { PublicFileUrl } from '@asurandi/types';
import { getAdminApp } from './getAdminApp.js';
import { env } from 'env.js';
import fs from 'fs/promises';
import path from 'node:path';

const app = getAdminApp();
const storage = getStorage(app);

export const storageSaveFile = async ({
    files,
    storagePath,
    bucketName = env.FIREBASE_STORAGE_BUCKET
}: {
    files: string[];
    storagePath: string;
    bucketName?: string;
}): Promise<PublicFileUrl[]> => {
    const results: PublicFileUrl[] = [];

    // 1. Limpiar storagePath para evitar segmentos vacíos
    const cleanStoragePath = storagePath.replace(/\/+$/, ''); // Elimina '/' al final
    if (!cleanStoragePath) {
        console.error("storagePath cannot be empty.");
        return []; // O lanza un error si lo prefieres.
    }

    for (let idx = 0; idx < files.length; idx++) {
        const fullPath = files[idx];
        const file = await fs.readFile(fullPath);
        const safeFileName = path.basename(fullPath);

        // 2. Generar un nombre de archivo seguro
        const fileName = `${cleanStoragePath}/${safeFileName}`; // Usar cleanStoragePath

        const bucket = storage.bucket(bucketName);
        const fileRef = bucket.file(fileName);

        try {
            await fileRef.save(file);
            const [metadata] = await fileRef.getMetadata();
            const downloadUrl = await getDownloadURL(fileRef);
            results.push({
                path: storagePath,
                fileName: safeFileName,
                url: downloadUrl,
                mimeType: metadata.contentType || 'application/octet-stream',
            }); // Usar el nombre original
        } catch (error) {
            console.error(`Error uploading file ${safeFileName}:`, error);
            results.push({ path: storagePath, fileName: safeFileName, url: null, error: error instanceof Error ? error.message : 'Error desconocido' }); // Incluir error
        }
    }
    return results;
};