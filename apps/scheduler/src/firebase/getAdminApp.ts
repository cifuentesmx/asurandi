import { getApps, getApp, initializeApp, cert } from "firebase-admin/app";
import { dev, env } from "../env.js";

const host = env.FIREBASE_EMULATORS_HOST;
const projectId = env.FIREBASE_PROJECT_ID;
const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n"
);

if (!projectId || !clientEmail || !privateKey) {
  throw new Error("Missing firebase adminSDK configuration emvironment.");
}

const adminConfig = {
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
};
export const getAdminApp = () => {
  if (getApps().length) {
    return getApp();
  } else {
    if (dev && env.FIREBASE_CONNECT_EMULATORS) {
      console.info("Conectando emuladores para el Admin SDK...");
      env["FIRESTORE_EMULATOR_HOST"] = `${host}:8080`;
      env["FIREBASE_AUTH_EMULATOR_HOST"] = `${host}:9099`;
      // TODO not working on emulator HOST
      env['FIREBASE_STORAGE_EMULATOR_HOST'] = `${host}:9199`;
    }
    return initializeApp(adminConfig);
  }
};


