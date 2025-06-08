import { getApps, getApp, initializeApp, cert } from "firebase-admin/app";
import { FIREBASE_STORAGE_BUCKET } from "../env.js";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
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
  storageBucket: FIREBASE_STORAGE_BUCKET
};
export const getAdminApp = () => {
  if (getApps().length) {
    return getApp();
  } else {
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.FIREBASE_CONNECT_EMULATORS === "true"
    ) {
      console.info("Conectando emuladores para el Admin SDK...");
      process.env["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8080";
      process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "127.0.0.1:9099";
      // TODO not working on emulator HOST
      process.env['FIREBASE_STORAGE_EMULATOR_HOST'] = '127.0.0.1:9199';
    }
    return initializeApp(adminConfig);
  }
};


