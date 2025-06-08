import fs from 'fs-extra';
import path from 'path';

export async function cleanupFiles(directoryPath: string, ageInMinutes: number = 30): Promise<void> {
    const now = Date.now();
    const ageInMilliseconds = ageInMinutes * 60 * 1000;

    try {
        const items = await fs.readdir(directoryPath);

        for (const item of items) {
            if (item === '.gitignore' || item === '.dockerignore') continue
            const itemPath = path.join(directoryPath, item);
            const stats = await fs.stat(itemPath);
            const age = now - stats.birthtimeMs;

            if (age > ageInMilliseconds) {
                if (stats.isDirectory()) {
                    await fs.remove(itemPath);
                } else {
                    await fs.unlink(itemPath);
                }
            }
        }
    } catch (error) {
        console.error(`${new Date()} - Error al borrar los archivos:`, error);
    }
}
