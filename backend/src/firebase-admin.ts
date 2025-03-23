// backend/firebase-admin.ts
import * as admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();
const serviceAccount = {
  type: "service_account",
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email:
    "firebase-adminsdk-fbsvc@visitcounter-47efc.iam.gserviceaccount.com",
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL:
    "https://visitcounter-47efc-default-rtdb.asia-southeast1.firebasedatabase.app/", // Thay bằng URL của bạn
});

const db = admin.database();
export default db;
