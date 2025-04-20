import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDYcUbUIwIcqRLSzZ2G_F0zScTowjlKkqY",
  authDomain: "univento-87b49.firebaseapp.com",
  projectId: "univento-87b49",
  storageBucket: "univento-87b49.firebasestorage.app",
  messagingSenderId: "852055517769",
  appId: "1:852055517769:web:7df1466fee50c38dcd2d98"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 