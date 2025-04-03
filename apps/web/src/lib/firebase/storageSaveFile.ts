import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import { initializeAdminApp } from './app.server';
import { PUBLIC_FIREBASE_STORAGE_BUCKET } from '$env/static/public';
import type { PublicFileUrl } from '@asurandi/types';

const app = initializeAdminApp();
const storage = getStorage(app);

export const storageSaveFile = async ({
    files,
    storagePath,
    bucketName = PUBLIC_FIREBASE_STORAGE_BUCKET
}: {
    files: FormDataEntryValue[];
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
        const file = files[idx];
        if (!(file instanceof Blob)) continue;
        if (file.size === 0) continue

        // 2. Generar un nombre de archivo seguro
        const originalFileName = file.name || `file_${idx}`; // Nombre original o uno genérico
        const safeFileName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_'); // Caracteres seguros
        const fileName = `${cleanStoragePath}/${safeFileName}`; // Usar cleanStoragePath

        const fileBuffer = await file.arrayBuffer();
        const bucket = storage.bucket(bucketName);
        const fileRef = bucket.file(fileName);

        try {
            await fileRef.save(Buffer.from(fileBuffer), {
                contentType: file.type || 'application/octet-stream'
            });
            const downloadUrl = await getDownloadURL(fileRef);
            results.push({
                path: storagePath,
                fileName: originalFileName,
                url: downloadUrl,
                mimeType: file.type || 'application/octet-stream'
            }); // Usar el nombre original
        } catch (error) {
            console.error(`Error uploading file ${originalFileName}:`, error);
            results.push({ path: storagePath, fileName: originalFileName, url: null, error: error instanceof Error ? error.message : 'Error desconocido' }); // Incluir error
        }
    }
    return results;
};