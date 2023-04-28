
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip'

import { Calendar, momentLocalizer } from 'react-big-calendar';
import { ref, onValue, set } from "firebase/database";
// Styles
import randomColor from 'randomcolor';
import styles from '@/styles/calendar.module.css'
import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-tooltip/dist/react-tooltip.css'

// Components
import CustomToolbar from '@/components/CustomToolbarCalendar';
// Libraries
import moment from 'moment';//time lib
import store from '../../utils/store';
import { db } from '../../src/lib/firebase';

 function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(true); // default user state
  const router = useRouter();
  const localizer = momentLocalizer(moment);

  const formats = { // React-big-calendar options
        weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture)};
 
  const handleLogout = () => {//Logout button logic
        setUser(null);};

  useEffect(() => { // Save event to Firebase when store changes
    const unsubscribe = store.subscribe(() => {
      const { event, uid } = store.getState();
      const eventRef = ref(db, `UserData/${uid}/events/${event.title}`);

        set(eventRef, {
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description,
        });
        
    });
    return () => {
      unsubscribe();
    };
  },[]);

  useEffect(() => {// Fetch events from Firebase when user state changes
    if (user == null) {
      router.push('/');
      } else {
          const uid = store.getState().uid;
          const eventsRef = ref(db, `UserData/${uid}/events`);
            
          onValue(eventsRef, (snapshot) => {
              const data = snapshot.val();
            if (data) {
                const newEvents = Object.keys(data).map((key) => {
                  return {
                  ...data[key],
                  start: new Date(data[key].start),
                  end: new Date(data[key].end),
                  };
                });
                setEvents(newEvents);
            }
          });
    }
  }, [user]);

  useEffect(() => {
    const uid = localStorage.getItem('uid');
    if (uid && user) {
      const eventsRef = ref(db, `UserData/${uid}/events`);
      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const newEvents = Object.keys(data).map((key) => {
            return {
              ...data[key],
              start: new Date(data[key].start),
              end: new Date(data[key].end),
            };
          });
          setEvents(newEvents);
        }
      });
    }
  }, [user, store.getState().uid]); 
  
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };
  
  const Event = ({ event }) => (
    <div >
      <div
        className={styles.eventTitle}
        title={event.description}
      >
        {event.title}
      </div>
    </div>
  );
  
  
  const eventStyleGetter = (event, start, end, isSelected) => {
    const color = randomColor({ luminosity: 'light' });
    return {
      style: {
        backgroundColor: color,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block'
      }
    };
  };
  
  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.logOutwrapper}>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className={styles.calendar}>
        <Calendar 
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          formats={formats}
          eventPropGetter={eventStyleGetter}

          titleAccessor={event => event.description}
          components={{
            toolbar: CustomToolbar,
            event: Event
          }}
          className={styles.calendar}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#FFFF',
            border: 'none',
          }}
          events={events}
          selectable={false}
        />

      </div>
    </div>
  );  
}

export default MyCalendar;