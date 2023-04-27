import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';

function Calendar() {
  const [user, setUser] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
  };
  useEffect( () => {
   if (user== null) {
     router.push('/');
     console.log(user)
   }
 }, [user])
  return (
    <>
      <h1>Calendar</h1>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default Calendar;
