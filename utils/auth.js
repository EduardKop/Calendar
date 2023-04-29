import { getDatabase, ref, onValue, get } from 'firebase/database';
import bcrypt from 'bcryptjs';
import store from './store';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

export async function login(username, password) {
  try {
    const userDataRef = ref(getDatabase(), 'UserData');
    const snapshot = await get(userDataRef);
    const users = snapshot.val();

    const user = Object.values(users).find(user => user.login === username);
    console.log(user)
    if (!user) {
      console.log('User not found!');
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password does not match!');
      return null;
    }

    await signInWithEmailAndPassword(auth, user.email, user.password);
    store.dispatch({ type: 'SET_UID', payload: user.uid });
    store.dispatch({ type: 'SET_EVENTS', payload: [] });
    localStorage.setItem('uid', user.uid);
    return user;
  } catch (error) {
    console.error(error);
    console.log('Failed to sign in with email and password');
    return null;
  }
}
