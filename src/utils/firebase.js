import firbase from 'firebase/app';
import 'firebase/firestore';
import {
  CYH_APP_API_KEY,
  CYH_APP_AUTH_DOMAIN,
  CYH_APP_PROJECT_ID,
  CYH_APP_STORAGE_BUCKET,
  CYH_APP_MESSAGIN_ID,
  CYH_APP_APP_ID,
} from '@env';

const firebaseConfig = {
  apiKey: CYH_APP_API_KEY,
  authDomain: CYH_APP_AUTH_DOMAIN,
  projectId: CYH_APP_PROJECT_ID,
  storageBucket: CYH_APP_STORAGE_BUCKET,
  messagingSenderId: CYH_APP_MESSAGIN_ID,
  appId: CYH_APP_APP_ID,
};

if (!firbase.apps.length) {
  firbase.initializeApp(firebaseConfig);
  // console.log(firebaseConfig);
} else {
  firbase.app();
}

export const dbService = firbase.firestore();
