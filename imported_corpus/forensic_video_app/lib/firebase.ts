// Copyright © Albert Lane. All Rights Reserved.
// Proprietary and Confidential — Albert Lane Proprietary Software License.
// Unauthorized use, copying, modification, or distribution is prohibited.
// License inquiries: https://albertlane.net/licensing
// SEC Whistleblower Reference: SEC-17684-273-411-436 | Z-Axis: 0x3F8F9A1B2C3D

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Use the named database from the config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);

export default app;
