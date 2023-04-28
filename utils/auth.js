import { db } from '../src/lib/firebase';
import { getDatabase, onValue, ref, get } from "firebase/database";
import bcrypt from 'bcryptjs';

export async function login(username, password) {
  const userDataRef = ref(db, 'UserData');
  try {
    const snapshot = await get(userDataRef);
    const users = snapshot.val();
    for (const uid in users) {
      const user = users[uid];
      if (user.login === username) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return user;
        } else {
          console.log('Password does not match!');
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}


