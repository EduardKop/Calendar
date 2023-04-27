import { db } from '../src/lib/firebase';
import { getDatabase, onValue, ref, get } from "firebase/database";

export async function login(username, password) {
  const userDataRef = ref(db, 'UserData');
  try {
    const snapshot = await get(userDataRef);
    const users = snapshot.val();
    for (const uid in users) {
      const user = users[uid];
      if (user.login === username && user.password === password) {
        console.log('Login successful');
        return user;
      }
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}
