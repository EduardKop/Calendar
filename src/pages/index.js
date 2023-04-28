import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import { db } from '../lib/firebase';
import { getDatabase, onValue, ref, get } from "firebase/database";
import { login } from '../../utils/auth';

import homePageImgHand  from '../../public/images/hand.png'
import showPasswordIcon from '../../public/images/showImg.png'
import hidePasswordIcon from '../../public/images/showImgWhite.png'


export default function Home() {
  const [loginValue,setLoginValue]  = useState('');
  const [passwordValue,setPasswordValue]  = useState('');
  const [showPassword,setShowPassword]  = useState(false);
  const [user,setUser]  = useState(null);
  const router = useRouter();


  const handleLoginChange    = (event) => {setLoginValue(event.target.value);}//Event handler for login value change
  const handlePasswordChange = (event) => {setPasswordValue(event.target.value);}//Event handler for password value change
  

  const handleLogin = async (event) => {// Event handler for login form submission
    event.preventDefault() 
    const userData = await login(loginValue, passwordValue);
      
      if (userData) { // If login was successful
        setUser(userData);   
        
      } 
      else{ // If login was unsuccessful
        console.log('не вірні данні')
      }
  }

  useEffect( () => {
    if (user) {// If user is logged in
      router.push('/calendar');
    }
  }, [user])
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
