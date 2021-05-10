import firebase from 'firebase/app';
import 'firebase/auth';

const dotenv = require('dotenv');

dotenv.config({ path: __dirname + ' .env' });

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAFxAJmF478g65I95mK2nCpXzJl2XPUtC0',
  authDomain: 'bean-swap.firebaseapp.com',
  projectId: 'bean-swap',
  storageBucket: 'bean-swap.appspot.com',
  messagingSenderId: '462321956064',
  appId: '1:462321956064:web:2cb371f519ac24609a0c85',
  measurementId: 'G-NQNV7X48FG',
};
// const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
