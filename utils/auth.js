import { db } from '../src/lib/firebase';
import { getDatabase, onValue, ref, get } from "firebase/database";
import bcrypt from 'bcryptjs';
import store from '../utils/store';

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
          store.dispatch({ type: 'SET_UID', payload: uid });

          // Get events for the user from Firebase and store them in the store
          const eventsRef = ref(db, `UserData/${uid}/events`);
          onValue(eventsRef, (snapshot) => {
            const eventsData = snapshot.val();
            const events = Object.keys(eventsData || {}).map((key) => {
              return {
                title: eventsData[key].title,
                start: new Date(eventsData[key].start),
                end: new Date(eventsData[key].end),
                description: eventsData[key].description,
              };
            });
            store.dispatch({ type: 'SET_EVENTS', payload: events });
          });
          
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
