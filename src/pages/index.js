import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { db, auth } from '../lib/firebase';
import { login } from '../../utils/auth';
import { getAuth,onAuthStateChanged } from 'firebase/auth';

import homePageImgHand from '../../public/images/hand.png';
import showPasswordIcon from '../../public/images/showImg.png';
import hidePasswordIcon from '../../public/images/showImgWhite.png';

import styles from '@/styles/Home.module.css';


export default function Home() {
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(null);
  
  const router = useRouter();

  const handleLoginChange = (event) => {
    setLoginValue(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPasswordValue(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!loginValue || !passwordValue) {
      setErrorMessage('Заповніть усі поля');
      return;
    }

    const userData = await login(loginValue, passwordValue);

    if (userData) {
      setUser(userData);
    } else {
      setErrorMessage('Невірний Логін або Пароль');
    }
  };
  
  useEffect(() => {
    if (user === null) {
      router.push('/');
    } else if (user) {
      router.push('/calendar');
    }
    
  }, [user]);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/');
      }
    });
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.greetingWrapper}>
          <h1 className={styles.greeting}>Welcome back</h1>
          <Image 
          src={homePageImgHand} 
          alt="Image" 
           />
        </div>
        <form className={styles.form}>
        <div className={styles.errorMessage}>{errorMessage}</div>

          <label htmlFor="login" className={styles.label}>
            <input type="text" id="username"  placeholder='Login' className={styles.input} onChange={handleLoginChange}/>
          </label>

          <label htmlFor="password" className={styles.label}>
            <div className={styles.passwordWrapper}>
              <input type={showPassword ? 'text' : 'password'} id="password" placeholder='Password' className={styles.input}  onChange={handlePasswordChange} />
              <Image
              src={showPassword ? hidePasswordIcon : showPasswordIcon}
              alt="Show password" onClick={() => setShowPassword(!showPassword)} /> 
            </div>
          </label>

          <div className={styles.checkboxContainer}>
            <div className={styles.checkboxWrapper}>
              <input type="checkbox" id="keepMeLoggedIn" className={styles.checkbox} />
              <label htmlFor="keepMeLoggedIn" className={styles.checkboxLabel}>Keep me logged in</label>
            </div>
            <a href="#" className={styles.forgotPassword}>Forgot password?</a>
          </div>

          <button type="submit" className={styles.button} onClick={handleLogin}>Log in</button>

        </form>
      </div>

      <div className={styles.imageContainer} ></div>

    </div>
  )
}
