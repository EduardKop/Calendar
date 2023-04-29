import { getAuth, signOut } from 'firebase/auth';
import store from './store';
import { app } from '../src/lib/firebase'; 

const auth = getAuth(app);

export default function logout(history) {
  try {
    signOut(auth);
    store.dispatch({ type: 'SET_UID', payload: null });
    localStorage.removeItem('uid');
    history.push('/');
    console.log('logout')
  } catch (error) {
    console.error(error);
  }
}