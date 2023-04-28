import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import styles from '@/styles/calendar.module.css'
import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomToolbar from '@/components/customToolbarCalendar';

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
            width: '100%',
            backgroundColor: '#F6F6F6',
            border: 'none',
            }}
        events={[
            {
            title: 'Event 1',
            start: moment().toDate(),
            end: moment().add(1, 'hours').toDate(),
            },
            {
            title: 'Event 2',
            start: moment().add(1, 'days').toDate(),
            end: moment().add(1, 'days').add(2, 'hours').toDate(),
            },
          ]}
        />
      </div>
    </div>
  );
  
}
export default MyCalendar;
