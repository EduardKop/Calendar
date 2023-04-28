import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import styles from '@/styles/calendar.module.css'
import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomToolbar from '@/components/CustomToolbarCalendar';

import moment from 'moment';//time lib




export  function MyCalendar() {
  const [user, setUser] = useState(true);
  const router = useRouter();
  const localizer = momentLocalizer(moment);

  //Format Days setting for react-big-calendar
  const formats = { weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),};
 
  //Logout button logic
  const handleLogout = () => {setUser(null);};
  useEffect( () => {
   if (user== null) {
     router.push('/');
   }},[user])


   

 
  return (
    <div className={styles.calendarWrapper}>
     <button onClick={handleLogout}>Logout</button>
      <div className={styles.calendar}>
        <Calendar 
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        formats={formats}
        components={{
            toolbar: CustomToolbar,
            }}
        className={styles.calendar}
        style={{
            height: '100%',
            width: '90%',
            backgroundColor: '#FFFF',
            border: 'none',
            }}
        events={[
            
            {
              title: 'Event 2',
              start: moment('2023-05-01').toDate(),
              end: moment('2023-05-02').toDate(),
              }
          ]}
          selectable={false}
        />
      </div>
    </div>
  );
  
}
export default MyCalendar;
